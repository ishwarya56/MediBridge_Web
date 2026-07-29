import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Clock, ShieldAlert, Search, Activity, ExternalLink, Compass, Loader, LocateFixed } from 'lucide-react';

// Haversine formula — returns distance in km between two lat/lng points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const ALL_HOSPITALS = [
  // ── Chennai ────────────────────────────────────────
  { id: 1,  name: "Apollo Hospitals", city: "Chennai", type: "Super Specialty & Trauma", address: "Greams Road, Thousand Lights, Chennai", phone: "+91 44 2829 0200", emergencyPhone: "+91 44 2829 0200", rating: 4.8, open24x7: true, bedsAvailable: 14, icuAvailable: true, lat: 13.0604, lng: 80.2496, mapQuery: "Apollo+Hospital+Greams+Road+Chennai" },
  { id: 2,  name: "Government General Hospital", city: "Chennai", type: "Government Medical College & ER", address: "EVR Periyar Salai, Park Town, Chennai", phone: "+91 44 2530 5000", emergencyPhone: "+91 44 2530 5000", rating: 4.5, open24x7: true, bedsAvailable: 42, icuAvailable: true, lat: 13.0827, lng: 80.2707, mapQuery: "Government+General+Hospital+Chennai" },
  { id: 3,  name: "Fortis Malar Hospital", city: "Chennai", type: "Cardiac & General Emergency", address: "1st Main Road, Gandhi Nagar, Adyar, Chennai", phone: "+91 44 4289 2222", emergencyPhone: "+91 44 4289 2222", rating: 4.7, open24x7: true, bedsAvailable: 8, icuAvailable: true, lat: 13.0067, lng: 80.2572, mapQuery: "Fortis+Malar+Hospital+Adyar+Chennai" },
  { id: 4,  name: "MIOT International", city: "Chennai", type: "Orthopedics & Multi-Specialty", address: "Mount Poonamallee Road, Manapakkam, Chennai", phone: "+91 44 4200 2288", emergencyPhone: "+91 44 4200 2288", rating: 4.6, open24x7: true, bedsAvailable: 19, icuAvailable: true, lat: 13.0232, lng: 80.1772, mapQuery: "MIOT+International+Hospital+Chennai" },
  { id: 5,  name: "Kauvery Hospital", city: "Chennai", type: "24x7 Acute & Critical Care", address: "Luz Church Road, Mylapore, Chennai", phone: "+91 44 4000 6000", emergencyPhone: "+91 44 4000 6000", rating: 4.9, open24x7: true, bedsAvailable: 6, icuAvailable: true, lat: 13.0339, lng: 80.2642, mapQuery: "Kauvery+Hospital+Mylapore+Chennai" },

  // ── Bengaluru ──────────────────────────────────────
  { id: 6,  name: "Manipal Hospital", city: "Bengaluru", type: "Multi-Specialty & Trauma Center", address: "98 HAL Airport Road, Kodihalli, Bengaluru", phone: "+91 80 2502 4444", emergencyPhone: "+91 80 2502 4444", rating: 4.8, open24x7: true, bedsAvailable: 22, icuAvailable: true, lat: 12.9602, lng: 77.6484, mapQuery: "Manipal+Hospital+Old+Airport+Road+Bangalore" },
  { id: 7,  name: "Narayana Health City", city: "Bengaluru", type: "Cardiac & Multi-Specialty", address: "258/A, Bommasandra Industrial Area, Bengaluru", phone: "+91 80 7122 2200", emergencyPhone: "+91 80 7122 2200", rating: 4.7, open24x7: true, bedsAvailable: 35, icuAvailable: true, lat: 12.8207, lng: 77.6881, mapQuery: "Narayana+Health+City+Bangalore" },
  { id: 8,  name: "Victoria Hospital (BMCRI)", city: "Bengaluru", type: "Government Trauma & Emergency", address: "Fort Rd, Krishnarajendra Market, Bengaluru", phone: "+91 80 2670 1150", emergencyPhone: "+91 80 2670 1150", rating: 4.3, open24x7: true, bedsAvailable: 55, icuAvailable: true, lat: 12.9716, lng: 77.5737, mapQuery: "Victoria+Hospital+Bangalore" },
  { id: 9,  name: "St. John's Medical College Hospital", city: "Bengaluru", type: "Medical College & ER", address: "Sarjapur Road, Koramangala, Bengaluru", phone: "+91 80 2206 5000", emergencyPhone: "+91 80 2206 5000", rating: 4.6, open24x7: true, bedsAvailable: 17, icuAvailable: true, lat: 12.9259, lng: 77.6229, mapQuery: "St+Johns+Medical+College+Hospital+Bangalore" },

  // ── Hyderabad ──────────────────────────────────────
  { id: 10, name: "KIMS Hospitals", city: "Hyderabad", type: "Multi-Specialty & Trauma", address: "1-8-31/1, Minister Road, Secunderabad, Hyderabad", phone: "+91 40 4488 5000", emergencyPhone: "+91 40 4488 5000", rating: 4.7, open24x7: true, bedsAvailable: 20, icuAvailable: true, lat: 17.4432, lng: 78.4983, mapQuery: "KIMS+Hospital+Secunderabad+Hyderabad" },
  { id: 11, name: "Yashoda Hospital", city: "Hyderabad", type: "Super Specialty & Neuro", address: "Raj Bhavan Road, Somajiguda, Hyderabad", phone: "+91 40 4567 4567", emergencyPhone: "+91 40 4567 4567", rating: 4.8, open24x7: true, bedsAvailable: 12, icuAvailable: true, lat: 17.4239, lng: 78.4533, mapQuery: "Yashoda+Hospital+Somajiguda+Hyderabad" },
  { id: 12, name: "Osmania General Hospital", city: "Hyderabad", type: "Government Medical College & ER", address: "Afzalganj, Hyderabad", phone: "+91 40 2460 4459", emergencyPhone: "+91 40 2460 4459", rating: 4.2, open24x7: true, bedsAvailable: 60, icuAvailable: true, lat: 17.3808, lng: 78.4800, mapQuery: "Osmania+General+Hospital+Hyderabad" },

  // ── Mumbai ─────────────────────────────────────────
  { id: 13, name: "Lilavati Hospital", city: "Mumbai", type: "Super Specialty & Cardiac", address: "A-791, Bandra Reclamation, Bandra West, Mumbai", phone: "+91 22 2675 1000", emergencyPhone: "+91 22 2675 1000", rating: 4.8, open24x7: true, bedsAvailable: 11, icuAvailable: true, lat: 19.0544, lng: 72.8236, mapQuery: "Lilavati+Hospital+Bandra+Mumbai" },
  { id: 14, name: "KEM Hospital (KEM)", city: "Mumbai", type: "Government Trauma & Emergency", address: "Acharya Donde Marg, Parel, Mumbai", phone: "+91 22 2410 7000", emergencyPhone: "+91 22 2410 7000", rating: 4.5, open24x7: true, bedsAvailable: 75, icuAvailable: true, lat: 19.0014, lng: 72.8420, mapQuery: "KEM+Hospital+Parel+Mumbai" },
  { id: 15, name: "Nanavati Max Hospital", city: "Mumbai", type: "Multi-Specialty & Oncology", address: "S.V. Road, Vile Parle West, Mumbai", phone: "+91 22 2626 7500", emergencyPhone: "+91 22 2626 7500", rating: 4.7, open24x7: true, bedsAvailable: 9, icuAvailable: true, lat: 19.1009, lng: 72.8398, mapQuery: "Nanavati+Hospital+Vile+Parle+Mumbai" },
  { id: 16, name: "Breach Candy Hospital", city: "Mumbai", type: "General & Specialty", address: "60-A, Bhulabhai Desai Road, Breach Candy, Mumbai", phone: "+91 22 2366 7888", emergencyPhone: "+91 22 2366 7888", rating: 4.6, open24x7: true, bedsAvailable: 7, icuAvailable: true, lat: 18.9682, lng: 72.8062, mapQuery: "Breach+Candy+Hospital+Mumbai" },

  // ── Delhi / NCR ────────────────────────────────────
  { id: 17, name: "AIIMS New Delhi", city: "Delhi", type: "Premier Government & Trauma", address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi", phone: "+91 11 2658 8500", emergencyPhone: "+91 11 2658 8700", rating: 4.9, open24x7: true, bedsAvailable: 80, icuAvailable: true, lat: 28.5672, lng: 77.2100, mapQuery: "AIIMS+New+Delhi" },
  { id: 18, name: "Safdarjung Hospital", city: "Delhi", type: "Government Medical College & ER", address: "Ansari Nagar West, New Delhi", phone: "+91 11 2616 5060", emergencyPhone: "+91 11 2616 5060", rating: 4.4, open24x7: true, bedsAvailable: 90, icuAvailable: true, lat: 28.5673, lng: 77.2057, mapQuery: "Safdarjung+Hospital+New+Delhi" },
  { id: 19, name: "Fortis Hospital Shalimar Bagh", city: "Delhi", type: "Super Specialty & Cardiac", address: "A Block, Shalimar Bagh, New Delhi", phone: "+91 11 4530 4530", emergencyPhone: "+91 11 4530 4530", rating: 4.7, open24x7: true, bedsAvailable: 13, icuAvailable: true, lat: 28.7214, lng: 77.1564, mapQuery: "Fortis+Hospital+Shalimar+Bagh+Delhi" },
  { id: 20, name: "Max Super Speciality Hospital", city: "Delhi", type: "Super Specialty & Neuro", address: "1, Press Enclave Road, Saket, New Delhi", phone: "+91 11 2651 5050", emergencyPhone: "+91 11 2651 5050", rating: 4.8, open24x7: true, bedsAvailable: 18, icuAvailable: true, lat: 28.5320, lng: 77.2122, mapQuery: "Max+Hospital+Saket+New+Delhi" },

  // ── Kolkata ────────────────────────────────────────
  { id: 21, name: "SSKM Hospital (PG Hospital)", city: "Kolkata", type: "Government Trauma & ER", address: "244, AJC Bose Road, Bhowanipore, Kolkata", phone: "+91 33 2223 8600", emergencyPhone: "+91 33 2223 8600", rating: 4.4, open24x7: true, bedsAvailable: 55, icuAvailable: true, lat: 22.5354, lng: 88.3432, mapQuery: "SSKM+Hospital+Kolkata" },
  { id: 22, name: "Peerless Hospital", city: "Kolkata", type: "Multi-Specialty & Cardiac", address: "360, Pancha Sayar Road, Kolkata", phone: "+91 33 4011 1222", emergencyPhone: "+91 33 4011 1222", rating: 4.6, open24x7: true, bedsAvailable: 16, icuAvailable: true, lat: 22.4766, lng: 88.3902, mapQuery: "Peerless+Hospital+Kolkata" },

  // ── Pune ───────────────────────────────────────────
  { id: 23, name: "Ruby Hall Clinic", city: "Pune", type: "Multi-Specialty & Trauma", address: "40, Sassoon Road, Sangamvadi, Pune", phone: "+91 20 6645 8888", emergencyPhone: "+91 20 6645 8888", rating: 4.7, open24x7: true, bedsAvailable: 21, icuAvailable: true, lat: 18.5362, lng: 73.8864, mapQuery: "Ruby+Hall+Clinic+Pune" },
  { id: 24, name: "Sahyadri Hospitals", city: "Pune", type: "Super Specialty & Neuro", address: "30C, Erandwane, Karve Road, Pune", phone: "+91 20 6721 6666", emergencyPhone: "+91 20 6721 6666", rating: 4.6, open24x7: true, bedsAvailable: 14, icuAvailable: true, lat: 18.5119, lng: 73.8352, mapQuery: "Sahyadri+Hospital+Pune" },
];

function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [filter, setFilter] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState(ALL_HOSPITALS[0]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Auto-request GPS on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      (err) => {
        setLocationError('Could not get your location. Distances are estimated.');
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };

  // Compute distances and sort if we have user location
  const hospitalsWithDistance = ALL_HOSPITALS.map(h => ({
    ...h,
    distanceKm: userLocation ? haversine(userLocation.lat, userLocation.lng, h.lat, h.lng) : null,
    distanceLabel: userLocation
      ? haversine(userLocation.lat, userLocation.lng, h.lat, h.lng) < 1
        ? `${(haversine(userLocation.lat, userLocation.lng, h.lat, h.lng) * 1000).toFixed(0)} m away`
        : `${haversine(userLocation.lat, userLocation.lng, h.lat, h.lng).toFixed(1)} km away`
      : h.distance || 'Distance N/A',
  }));

  const sortedHospitals = userLocation
    ? [...hospitalsWithDistance].sort((a, b) => a.distanceKm - b.distanceKm)
    : hospitalsWithDistance;

  const cities = ['All', ...Array.from(new Set(ALL_HOSPITALS.map(h => h.city))).sort()];

  const filteredHospitals = sortedHospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'All' || h.city === cityFilter;
    if (filter === 'icu') return matchesSearch && matchesCity && h.icuAvailable;
    if (filter === 'beds') return matchesSearch && matchesCity && h.bedsAvailable > 10;
    return matchesSearch && matchesCity;
  });

  const mapsNearMeUrl = userLocation
    ? `https://www.google.com/maps/search/hospitals/@${userLocation.lat},${userLocation.lng},14z`
    : 'https://www.google.com/maps/search/hospitals+near+me';

  // OpenStreetMap embed URL (always works, no API key needed)
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${selectedHospital.lng - 0.01},${selectedHospital.lat - 0.01},${selectedHospital.lng + 0.01},${selectedHospital.lat + 0.01}&layer=mapnik&marker=${selectedHospital.lat},${selectedHospital.lng}`;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass color="var(--primary)" size={28} /> Nearby Hospitals & Emergency Care
          </h1>
          <p style={{ color: 'rgba(0,0,0,0.55)', margin: 0, fontSize: '13px' }}>
            {userLocation
              ? `📍 Using your GPS location — showing ${filteredHospitals.length} hospitals sorted by distance`
              : `Showing ${filteredHospitals.length} hospitals across major Indian cities`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={requestLocation}
            className="btn"
            style={{ background: 'rgba(25,118,210,0.1)', color: 'var(--primary)', gap: '8px', fontSize: '13px' }}
          >
            {locationLoading ? <Loader size={16} className="animate-spin" /> : <LocateFixed size={16} />}
            {locationLoading ? 'Locating...' : userLocation ? 'Refresh GPS' : 'Use My Location'}
          </button>
          <a
            href={mapsNearMeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ gap: '8px', fontSize: '13px', textDecoration: 'none' }}
          >
            <Navigation size={16} /> Open Live GPS Maps <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Location status */}
      {locationError && (
        <div style={{ background: '#FFF3E0', color: '#E65100', padding: '10px 16px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚠️ {locationError}
          <button onClick={requestLocation} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#E65100', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline', fontSize: '13px' }}>Retry</button>
        </div>
      )}

      {/* Emergency Helpline Banner */}
      <div className="three-d-effect" style={{ background: 'linear-gradient(135deg, #1976D2, #0288D1)', padding: '18px 24px', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px' }}>National Medical Emergency: 108</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Free 24×7 Ambulance & Triage Dispatch across India</p>
          </div>
        </div>
        <a href="tel:108" className="btn" style={{ background: 'white', color: '#1976D2', textDecoration: 'none', fontWeight: '800', fontSize: '15px' }}>
          <Phone size={18} /> Call 108 Now
        </a>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: '200px' }}>
          <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.4)' }} />
          <input
            type="text"
            placeholder="Search hospital, specialty, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px' }}
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--surface)', color: 'var(--on-surface)', fontWeight: '600', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
        >
          {cities.map(c => <option key={c} value={c}>{c === 'All' ? '🏙️ All Cities' : c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[['all', 'All'], ['icu', 'ICU Available'], ['beds', 'High Beds (>10)']].map(([val, label]) => (
            <button key={val} className="btn" onClick={() => setFilter(val)}
              style={{ background: filter === val ? 'var(--primary)' : 'rgba(0,0,0,0.05)', color: filter === val ? 'white' : 'var(--on-surface)', fontSize: '12px', padding: '8px 14px' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
        {/* Hospital Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '640px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredHospitals.map((hospital) => {
            const isSelected = selectedHospital.id === hospital.id;
            return (
              <div
                key={hospital.id}
                className="three-d-effect"
                onClick={() => setSelectedHospital(hospital)}
                style={{
                  padding: '18px', cursor: 'pointer',
                  borderLeft: isSelected ? '6px solid var(--primary)' : '1px solid rgba(255,255,255,0.5)',
                  background: isSelected ? 'rgba(25, 118, 210, 0.04)' : 'var(--surface)',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 4px', color: 'var(--on-surface)' }}>{hospital.name}</h3>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(25, 118, 210, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>{hospital.type}</span>
                      <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '6px' }}>📍 {hospital.city}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#388E3C', background: '#E8F5E9', padding: '3px 8px', borderRadius: '8px', flexShrink: 0, marginLeft: '8px' }}>★ {hospital.rating}</span>
                </div>

                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={13} color="var(--primary)" /> {hospital.address}
                </p>

                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', margin: '10px 0 14px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '600' }}>
                    <Navigation size={13} /> {hospital.distanceLabel}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hospital.bedsAvailable > 10 ? '#2E7D32' : '#E65100', fontWeight: '600' }}>
                    <Activity size={13} /> {hospital.bedsAvailable} Beds Free
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1565C0', fontWeight: '600' }}>
                    <Clock size={13} /> 24/7 ER
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`tel:${hospital.phone}`} onClick={(e) => e.stopPropagation()} className="btn"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '12px', background: 'rgba(25,118,210,0.1)', color: 'var(--primary)', textDecoration: 'none', justifyContent: 'center' }}>
                    <Phone size={13} /> Call ER
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                    target="_blank" rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '7px 10px', fontSize: '12px', textDecoration: 'none', justifyContent: 'center' }}>
                    <Navigation size={13} /> Directions
                  </a>
                </div>
              </div>
            );
          })}

          {filteredHospitals.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: '14px' }}>
              🏥 No hospitals match your search. Try a different query or city.
            </div>
          )}
        </div>

        {/* Selected Hospital Detail + Map */}
        <div className="three-d-effect" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h2 style={{ fontSize: '19px', margin: '0 0 4px', color: 'var(--primary)' }}>{selectedHospital.name}</h2>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(0,0,0,0.55)' }}>📍 {selectedHospital.address}</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
              <Navigation size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {selectedHospital.distanceLabel}
            </p>
          </div>

          {/* OpenStreetMap Embed — always works, no API key */}
          <div style={{ width: '100%', height: '260px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
            <iframe
              title={`Map of ${selectedHospital.name}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={osmEmbedUrl}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ color: 'rgba(0,0,0,0.45)', display: 'block', fontSize: '10px', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Available Beds</span>
              <strong style={{ color: '#2E7D32', fontSize: '18px' }}>{selectedHospital.bedsAvailable}</strong>
              <span style={{ color: '#2E7D32', fontSize: '13px' }}> Beds</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ color: 'rgba(0,0,0,0.45)', display: 'block', fontSize: '10px', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ICU Status</span>
              <strong style={{ color: selectedHospital.icuAvailable ? '#1565C0' : '#C62828', fontSize: '18px' }}>
                {selectedHospital.icuAvailable ? '✅ Ready' : '❌ Full'}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href={`tel:${selectedHospital.emergencyPhone}`} className="btn btn-primary"
              style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
              <Phone size={17} /> Call Emergency: {selectedHospital.emergencyPhone}
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lng}`}
              target="_blank" rel="noreferrer"
              className="btn"
              style={{ width: '100%', background: 'rgba(0,0,0,0.05)', color: 'var(--on-surface)', textDecoration: 'none', justifyContent: 'center' }}>
              <Navigation size={17} /> Get Directions <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
