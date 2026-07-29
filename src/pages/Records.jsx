import React, { useState, useEffect } from 'react';
import { Upload, File, FileText, Image as ImageIcon, Trash2, Link as LinkIcon, Loader, FolderHeart } from 'lucide-react';
import { db, auth, collection, addDoc, doc, deleteDoc, onSnapshot, query, orderBy } from '../firebase';

function Records({ user }) {
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const CLOUDINARY_CLOUD_NAME = "dzfxoyrxf";
  const CLOUDINARY_UPLOAD_PRESET = "ishwarya";

  useEffect(() => {
    const uid = user?.uid || auth.currentUser?.uid;
    if (!uid) {
      setLoadingRecords(false);
      return;
    }

    const recordsRef = collection(db, 'users', uid, 'records');

    const unsubscribe = onSnapshot(
      recordsRef,
      (snapshot) => {
        const fetchedRecords = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        fetchedRecords.sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
        setRecords(fetchedRecords);
        setLoadingRecords(false);
      },
      (error) => {
        console.error("Firestore sync error:", error);
        setLoadingRecords(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uid = user?.uid || auth.currentUser?.uid;
    if (!uid) {
      alert("Please sign in to upload health records.");
      return;
    }

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", "auto");

    setProgress(40);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setProgress(80);

      if (res.ok) {
        // Save record metadata directly to Firestore users/{uid}/records
        const recordsRef = collection(db, 'users', uid, 'records');
        const rawTitle = file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
        
        await addDoc(recordsRef, {
          title: rawTitle,
          fileName: file.name,
          fileUrl: data.secure_url,
          fileType: file.type || "application/octet-stream",
          uploadedAt: Date.now()
        });
      } else {
        alert("Upload Failed: " + (data.error?.message || "Cloudinary error"));
      }
    } catch (err) {
      alert("Error uploading file: " + err.message);
    } finally {
      setProgress(100);
      setTimeout(() => setUploading(false), 500);
    }
  };

  const handleDelete = async (recordId) => {
    const uid = user?.uid || auth.currentUser?.uid;
    if (!uid) return;

    if (!window.confirm("Are you sure you want to delete this health record?")) return;

    try {
      await deleteDoc(doc(db, 'users', uid, 'records', recordId));
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    }
  };

  const getFileIcon = (type = '') => {
    if (type.includes('image')) return <ImageIcon size={32} color="#4CAF50" />;
    if (type.includes('pdf')) return <FileText size={32} color="#F44336" />;
    return <File size={32} color="var(--primary)" />;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '8px' }}>Health Records</h1>
          <p style={{ color: 'rgba(0,0,0,0.6)' }}>Store your reports securely (Synced across Web & Android)</p>
        </div>
        
        <div>
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
          <label htmlFor="file-upload" className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={20} />
            Upload File
          </label>
        </div>
      </div>

      {uploading && (
        <div className="three-d-effect" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Loader className="animate-spin" color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>Uploading file to Cloud...</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s' }} />
            </div>
          </div>
        </div>
      )}

      {loadingRecords ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--primary)' }}>
          <Loader className="animate-spin" size={32} style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: '500' }}>Syncing records from Firebase Cloud...</p>
        </div>
      ) : records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'rgba(0,0,0,0.4)' }}>
          <FolderHeart size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <h3>No Records Yet</h3>
          <p>Tap the upload button to add your first health record</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {records.map(record => (
            <div key={record.id} className="three-d-effect" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
                {getFileIcon(record.fileType)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{record.title}</h3>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>{record.fileName}</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(0,0,0,0.4)' }}>
                  {record.uploadedAt ? new Date(record.uploadedAt).toLocaleString() : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => window.open(record.fileUrl, '_blank')}
                  title="View / Download File"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(25, 118, 210, 0.1)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <LinkIcon size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(record.id)}
                  title="Delete Record"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(179, 38, 30, 0.1)', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Records;
