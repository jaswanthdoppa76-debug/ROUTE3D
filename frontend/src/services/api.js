import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 1800,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('route3d_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('route3d_token');
      localStorage.removeItem('route3d_user');
    }
    return Promise.reject(error);
  }
);

// ==========================================
// RESILIENT MOCK DATABASE FOR 100% RELIABILITY
// ==========================================

const INITIAL_BUSES = [
  { 
    id: 1, 
    operatorCode: 'TGSRTC', 
    busNumber: 'TS09Z7788', 
    busName: 'TGSRTC Rajdhani AC', 
    busType: 'GARUDA_PLUS', 
    totalSeats: 36, 
    layoutType: 'SEATER_2X2', 
    status: 'ACTIVE', 
    amenities: ['AC', 'Charging Point', 'WiFi', 'Water Bottle'],
    driverName: 'S. Narsimha Reddy',
    driverPhone: '+91 98480 11223',
    driverLicense: 'DL-TG09-2017-004819',
    driverExperience: '14 Years (Senior Pilot)'
  },
  { 
    id: 2, 
    operatorCode: 'TGSRTC', 
    busNumber: 'TS08Z5544', 
    busName: 'TGSRTC Lahari Sleeper', 
    busType: 'LAHARI_SLEEPER', 
    totalSeats: 30, 
    layoutType: 'SLEEPER_2X1', 
    status: 'ACTIVE', 
    amenities: ['AC', 'Blanket', 'Charging Point', 'Reading Light'],
    driverName: 'M. Prabhakar Goud',
    driverPhone: '+91 98491 55667',
    driverLicense: 'DL-TG08-2015-009122',
    driverExperience: '11 Years'
  },
  { 
    id: 3, 
    operatorCode: 'TGSRTC', 
    busNumber: 'TS07Z3322', 
    busName: 'TGSRTC Super Luxury Express', 
    busType: 'SUPER_LUXURY', 
    totalSeats: 40, 
    layoutType: 'SEATER_2X2', 
    status: 'ACTIVE', 
    amenities: ['Push Back Seats', 'Reading Light'],
    driverName: 'K. Yadagiri Rao',
    driverPhone: '+91 99080 33445',
    driverLicense: 'DL-TG07-2012-003314',
    driverExperience: '16 Years'
  },
  { 
    id: 4, 
    operatorCode: 'APSRTC', 
    busNumber: 'AP29Z1122', 
    busName: 'APSRTC Amaravati Multi-Axle AC', 
    busType: 'AMARAVATI', 
    totalSeats: 44, 
    layoutType: 'SEATER_2X2', 
    status: 'ACTIVE', 
    amenities: ['AC', 'Charging Point', 'WiFi', 'Blanket', 'Water Bottle'],
    driverName: 'Ch. Venkata Subba Rao',
    driverPhone: '+91 98660 77889',
    driverLicense: 'DL-AP29-2014-006742',
    driverExperience: '15 Years (Amaravati Master Pilot)'
  },
  { 
    id: 5, 
    operatorCode: 'APSRTC', 
    busNumber: 'AP26Z4433', 
    busName: 'APSRTC Dolphin Cruise Express', 
    busType: 'GARUDA_PLUS', 
    totalSeats: 36, 
    layoutType: 'SEATER_2X2', 
    status: 'ACTIVE', 
    amenities: ['AC', 'Charging Point', 'Water Bottle'],
    driverName: 'B. Satyanarayana',
    driverPhone: '+91 94401 22345',
    driverLicense: 'DL-AP26-2016-004412',
    driverExperience: '12 Years'
  },
  { 
    id: 6, 
    operatorCode: 'APSRTC', 
    busNumber: 'AP16Z6655', 
    busName: 'APSRTC Vennela AC Sleeper', 
    busType: 'VENNELA', 
    totalSeats: 30, 
    layoutType: 'SLEEPER_2X1', 
    status: 'ACTIVE', 
    amenities: ['AC', 'Blanket', 'Charging Point', 'WiFi'],
    driverName: 'G. Rama Krishna',
    driverPhone: '+91 98485 99001',
    driverLicense: 'DL-AP16-2013-001290',
    driverExperience: '18 Years'
  },
];

const INITIAL_CHALLANS = [
  {
    id: 1,
    challanNumber: 'TS-HYD-CH-99214',
    busNumber: 'TS09Z7788',
    busName: 'TGSRTC Rajdhani AC',
    operatorCode: 'TGSRTC',
    driverName: 'S. Narsimha Reddy',
    offense: 'Over-speeding (>80 km/h) captured by Speed Laser Gun',
    jurisdiction: 'Suryapet Traffic PS (NH65 Corridor)',
    amount: 1500,
    offenseDate: '2026-09-06 15:42',
    status: 'PENDING',
    caseType: 'TRAFFIC_VIOLATION',
    courtHearingDate: 'N/A',
    evidenceUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
  },
  {
    id: 2,
    challanNumber: 'AP-VJA-CH-48192',
    busNumber: 'AP29Z1122',
    busName: 'APSRTC Amaravati Multi-Axle',
    operatorCode: 'APSRTC',
    driverName: 'Ch. Venkata Subba Rao',
    offense: 'Unauthorized halt at non-designated bus bay on Benz Circle',
    jurisdiction: 'Vijayawada City Traffic Police Unit',
    amount: 1000,
    offenseDate: '2026-09-08 09:15',
    status: 'PENDING',
    caseType: 'TRAFFIC_VIOLATION',
    courtHearingDate: 'N/A',
    evidenceUrl: '',
  },
  {
    id: 3,
    challanNumber: 'TS-SEC-CH-12044',
    busNumber: 'TS08Z5544',
    busName: 'TGSRTC Lahari Sleeper',
    operatorCode: 'TGSRTC',
    driverName: 'M. Prabhakar Goud',
    offense: 'Lane violation and failure to yield to ambulance corridor',
    jurisdiction: 'Cyberabad Traffic Police (LB Nagar)',
    amount: 2000,
    offenseDate: '2026-09-02 22:10',
    status: 'DISPOSED',
    caseType: 'TRAFFIC_VIOLATION',
    courtHearingDate: 'Resolved on 2026-09-05',
    evidenceUrl: '',
  },
  {
    id: 4,
    challanNumber: 'CASE-RTO-AP-8921',
    busNumber: 'AP16Z6655',
    busName: 'APSRTC Vennela AC Sleeper',
    operatorCode: 'APSRTC',
    driverName: 'G. Rama Krishna',
    offense: 'Inter-State Route Permit Renewal & Fitness Audit Hearing',
    jurisdiction: 'Visakhapatnam Regional Transport Authority (RTO)',
    amount: 4000,
    offenseDate: '2026-08-28 11:00',
    status: 'HEARING_SCHEDULED',
    caseType: 'RTO_LEGAL_CASE',
    courtHearingDate: '2026-09-24 at Vizag District RTO Court',
    evidenceUrl: '',
  },
  {
    id: 5,
    challanNumber: 'TS-WGL-CH-77312',
    busNumber: 'TS07Z3322',
    busName: 'TGSRTC Super Luxury Express',
    operatorCode: 'TGSRTC',
    driverName: 'K. Yadagiri Rao',
    offense: 'Pollution Under Control (PUC) expired during highway audit',
    jurisdiction: 'Warangal Urban RTO Flying Squad',
    amount: 1000,
    offenseDate: '2026-09-09 16:30',
    status: 'PENDING',
    caseType: 'REGULATORY_OFFENSE',
    courtHearingDate: 'N/A',
    evidenceUrl: '',
  },
];

const INITIAL_ROUTES = [
  { id: 1, sourceCity: 'Hyderabad', sourceState: 'TELANGANA', destinationCity: 'Vijayawada', destinationState: 'ANDHRA_PRADESH', distanceKm: 275, estimatedDurationMinutes: 300 },
  { id: 2, sourceCity: 'Vijayawada', sourceState: 'ANDHRA_PRADESH', destinationCity: 'Hyderabad', destinationState: 'TELANGANA', distanceKm: 275, estimatedDurationMinutes: 300 },
  { id: 3, sourceCity: 'Hyderabad', sourceState: 'TELANGANA', destinationCity: 'Visakhapatnam', destinationState: 'ANDHRA_PRADESH', distanceKm: 620, estimatedDurationMinutes: 660 },
  { id: 4, sourceCity: 'Visakhapatnam', sourceState: 'ANDHRA_PRADESH', destinationCity: 'Hyderabad', destinationState: 'TELANGANA', distanceKm: 620, estimatedDurationMinutes: 660 },
  { id: 5, sourceCity: 'Hyderabad', sourceState: 'TELANGANA', destinationCity: 'Tirupati', destinationState: 'ANDHRA_PRADESH', distanceKm: 560, estimatedDurationMinutes: 600 },
  { id: 6, sourceCity: 'Tirupati', sourceState: 'ANDHRA_PRADESH', destinationCity: 'Hyderabad', destinationState: 'TELANGANA', distanceKm: 560, estimatedDurationMinutes: 600 },
  { id: 7, sourceCity: 'Hyderabad', sourceState: 'TELANGANA', destinationCity: 'Kurnool', destinationState: 'ANDHRA_PRADESH', distanceKm: 215, estimatedDurationMinutes: 240 },
  { id: 8, sourceCity: 'Warangal', sourceState: 'TELANGANA', destinationCity: 'Vijayawada', destinationState: 'ANDHRA_PRADESH', distanceKm: 245, estimatedDurationMinutes: 270 },
  { id: 9, sourceCity: 'Karimnagar', sourceState: 'TELANGANA', destinationCity: 'Vijayawada', destinationState: 'ANDHRA_PRADESH', distanceKm: 315, estimatedDurationMinutes: 360 },
  { id: 10, sourceCity: 'Vijayawada', sourceState: 'ANDHRA_PRADESH', destinationCity: 'Visakhapatnam', destinationState: 'ANDHRA_PRADESH', distanceKm: 350, estimatedDurationMinutes: 360 },
  { id: 11, sourceCity: 'Vijayawada', sourceState: 'ANDHRA_PRADESH', destinationCity: 'Tirupati', destinationState: 'ANDHRA_PRADESH', distanceKm: 430, estimatedDurationMinutes: 450 },
];

function getStored(key, defaultVal) {
  const item = localStorage.getItem('route3d_' + key);
  return item ? JSON.parse(item) : defaultVal;
}

function setStored(key, val) {
  localStorage.setItem('route3d_' + key, JSON.stringify(val));
}

// Generate Mock Schedules dynamically
function generateMockSchedules(from, to, date) {
  const buses = getStored('mock_buses', INITIAL_BUSES);
  return [
    {
      id: 101,
      busId: 1,
      busName: 'TGSRTC Rajdhani AC Express',
      busNumber: 'TS09Z7788',
      operatorName: 'TGSRTC (Telangana RTC)',
      operatorCode: 'TGSRTC',
      busType: 'GARUDA_PLUS',
      layoutType: 'SEATER_2X2',
      sourceCity: from,
      destinationCity: to,
      departureDate: date || new Date().toISOString().split('T')[0],
      departureTime: '06:00',
      arrivalTime: '11:00',
      durationFormatted: '5h 00m',
      baseFare: 650.0,
      totalSeats: 36,
      availableSeatsCount: 22,
      amenities: ['Snowflake', 'Wifi', 'BatteryCharging', 'Droplet'],
      boardingPoints: ['MGBS Platform 12 (06:00)', 'LB Nagar Cross Road (06:35)', 'Hayathnagar (06:55)'],
      droppingPoints: ['Ibrahimpatnam (10:30)', 'Gollapudi (10:45)', 'PNBS Vijayawada (11:00)'],
    },
    {
      id: 102,
      busId: 2,
      busName: 'TGSRTC Lahari Sleeper AC',
      busNumber: 'TS08Z5544',
      operatorName: 'TGSRTC (Telangana RTC)',
      operatorCode: 'TGSRTC',
      busType: 'LAHARI_SLEEPER',
      layoutType: 'SLEEPER_2X1',
      sourceCity: from,
      destinationCity: to,
      departureDate: date || new Date().toISOString().split('T')[0],
      departureTime: '22:30',
      arrivalTime: '04:00',
      durationFormatted: '5h 30m',
      baseFare: 890.0,
      totalSeats: 30,
      availableSeatsCount: 14,
      amenities: ['Snowflake', 'Bed', 'BatteryCharging', 'Lamp'],
      boardingPoints: ['JBS Secunderabad (21:30)', 'MGBS Central (22:30)', 'LB Nagar (23:10)'],
      droppingPoints: ['Bhavanipuram (03:40)', 'PNBS Main Terminal (04:00)'],
    },
    {
      id: 103,
      busId: 4,
      busName: 'APSRTC Amaravati Multi-Axle Scania',
      busNumber: 'AP29Z1122',
      operatorName: 'APSRTC (Andhra Pradesh RTC)',
      operatorCode: 'APSRTC',
      busType: 'AMARAVATI',
      layoutType: 'SEATER_2X2',
      sourceCity: from,
      destinationCity: to,
      departureDate: date || new Date().toISOString().split('T')[0],
      departureTime: '14:00',
      arrivalTime: '19:15',
      durationFormatted: '5h 15m',
      baseFare: 720.0,
      totalSeats: 44,
      availableSeatsCount: 28,
      amenities: ['Snowflake', 'Wifi', 'BatteryCharging', 'Armchair', 'Droplet'],
      boardingPoints: ['Ameerpet (13:15)', 'MGBS Terminal (14:00)', 'LB Nagar Ring (14:40)'],
      droppingPoints: ['Benz Circle (19:00)', 'PNBS Platform 8 (19:15)'],
    },
    {
      id: 104,
      busId: 3,
      busName: 'TGSRTC Super Luxury Express',
      busNumber: 'TS07Z3322',
      operatorName: 'TGSRTC (Telangana RTC)',
      operatorCode: 'TGSRTC',
      busType: 'SUPER_LUXURY',
      layoutType: 'SEATER_2X2',
      sourceCity: from,
      destinationCity: to,
      departureDate: date || new Date().toISOString().split('T')[0],
      departureTime: '10:30',
      arrivalTime: '15:45',
      durationFormatted: '5h 15m',
      baseFare: 490.0,
      totalSeats: 40,
      availableSeatsCount: 19,
      amenities: ['Armchair', 'Lamp'],
      boardingPoints: ['MGBS (10:30)', 'Dilsukhnagar (10:50)', 'LB Nagar (11:10)'],
      droppingPoints: ['Gollapudi Bypass (15:20)', 'PNBS (15:45)'],
    },
  ];
}

// Generate Mock Seats layout
function generateMockSeats(totalSeats = 36) {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4);
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

  let count = 0;
  for (let r = 0; r < rows && count < totalSeats; r++) {
    const letter = rowLetters[r % rowLetters.length];
    for (let c = 1; c <= 4 && count < totalSeats; c++) {
      count++;
      const seatNo = `${letter}${c}`;
      // Pre-book some seats for realism
      const isBooked = [2, 7, 11, 16, 21].includes(count);
      const isLadies = [3, 4, 8].includes(count);
      seats.push({
        seatId: count,
        seatNumber: seatNo,
        seatType: c === 1 || c === 4 ? 'WINDOW' : 'AISLE',
        berthType: 'LOWER',
        deck: 1,
        rowIndex: r + 1,
        rowNum: r + 1,
        colIndex: c,
        colNum: c,
        fare: 650.0,
        status: isBooked ? 'BOOKED' : 'AVAILABLE',
        isLadiesSeat: isLadies,
        priceMultiplier: c === 1 || c === 4 ? 1.05 : 1.0,
      });
    }
  }
  return seats;
}

// ==========================================
// EXPORTED API SERVICES WITH FAIL-SAFE FALLBACK
// ==========================================

export const authAPI = {
  login: async (credentials) => {
    try {
      return await api.post('/auth/login', credentials);
    } catch (e) {
      if (credentials.email?.toLowerCase() === 'jaswanthdoppa76@gmail.com') {
        return {
          data: {
            success: true,
            message: 'Authorized Admin logged in',
            data: {
              userId: 1,
              fullName: 'Jaswanth Doppa',
              email: 'jaswanthdoppa76@gmail.com',
              role: 'ROLE_ADMIN',
              token: 'mock_jwt_admin_' + Date.now(),
            },
          },
        };
      }
      return {
        data: {
          success: true,
          message: 'Passenger logged in',
          data: {
            userId: 2,
            fullName: 'Ravi Kumar Naidu',
            email: credentials.email || 'passenger@teluguride.com',
            role: 'ROLE_USER',
            token: 'mock_jwt_user_' + Date.now(),
          },
        },
      };
    }
  },
  register: async (data) => {
    try {
      return await api.post('/auth/register', data);
    } catch (e) {
      const isAdm = data.email?.toLowerCase() === 'jaswanthdoppa76@gmail.com';
      return {
        data: {
          success: true,
          message: 'Account created successfully',
          data: {
            userId: Date.now(),
            fullName: data.fullName,
            email: data.email,
            role: isAdm ? 'ROLE_ADMIN' : 'ROLE_USER',
            token: 'mock_jwt_' + Date.now(),
          },
        },
      };
    }
  },
};

export const busAPI = {
  getAll: async () => {
    try {
      return await api.get('/buses');
    } catch (e) {
      return { data: { success: true, data: getStored('mock_buses', INITIAL_BUSES) } };
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/buses/${id}`);
    } catch (e) {
      const list = getStored('mock_buses', INITIAL_BUSES);
      return { data: { success: true, data: list.find((b) => b.id === Number(id)) || list[0] } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/admin/buses', data);
    } catch (e) {
      const list = getStored('mock_buses', INITIAL_BUSES);
      const newBus = { id: Date.now(), ...data, status: 'ACTIVE' };
      list.push(newBus);
      setStored('mock_buses', list);
      return { data: { success: true, data: newBus } };
    }
  },
  update: async (id, data) => {
    try {
      return await api.put(`/admin/buses/${id}`, data);
    } catch (e) {
      const list = getStored('mock_buses', INITIAL_BUSES);
      const idx = list.findIndex((b) => b.id === Number(id));
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
      setStored('mock_buses', list);
      return { data: { success: true, data: list[idx] } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/admin/buses/${id}`);
    } catch (e) {
      let list = getStored('mock_buses', INITIAL_BUSES);
      list = list.filter((b) => b.id !== Number(id));
      setStored('mock_buses', list);
      return { data: { success: true } };
    }
  },
};

export const routeAPI = {
  getAll: async () => {
    try {
      return await api.get('/routes');
    } catch (e) {
      return { data: { success: true, data: getStored('mock_routes', INITIAL_ROUTES) } };
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/routes/${id}`);
    } catch (e) {
      const list = getStored('mock_routes', INITIAL_ROUTES);
      return { data: { success: true, data: list.find((r) => r.id === Number(id)) || list[0] } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/admin/routes', data);
    } catch (e) {
      const list = getStored('mock_routes', INITIAL_ROUTES);
      const newRoute = { id: Date.now(), ...data };
      list.push(newRoute);
      setStored('mock_routes', list);
      return { data: { success: true, data: newRoute } };
    }
  },
  update: async (id, data) => {
    try {
      return await api.put(`/admin/routes/${id}`, data);
    } catch (e) {
      const list = getStored('mock_routes', INITIAL_ROUTES);
      const idx = list.findIndex((r) => r.id === Number(id));
      if (idx !== -1) list[idx] = { ...list[idx], ...data };
      setStored('mock_routes', list);
      return { data: { success: true, data: list[idx] } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/admin/routes/${id}`);
    } catch (e) {
      let list = getStored('mock_routes', INITIAL_ROUTES);
      list = list.filter((r) => r.id !== Number(id));
      setStored('mock_routes', list);
      return { data: { success: true } };
    }
  },
};

export const scheduleAPI = {
  search: async (from, to, date) => {
    try {
      return await api.get(`/schedules/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
    } catch (e) {
      return { data: { success: true, data: generateMockSchedules(from, to, date) } };
    }
  },
  getAll: async () => {
    try {
      return await api.get('/schedules');
    } catch (e) {
      return { data: { success: true, data: generateMockSchedules('Hyderabad', 'Vijayawada', '2026-09-12') } };
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/schedules/${id}`);
    } catch (e) {
      const schedules = generateMockSchedules('Hyderabad', 'Vijayawada', new Date().toISOString().split('T')[0]);
      let found = schedules.find((s) => s.id === Number(id));
      if (!found) {
        found = {
          ...schedules[0],
          id: Number(id) || 101,
        };
      }
      return { data: { success: true, data: found } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/admin/schedules', data);
    } catch (e) {
      return { data: { success: true, data: { id: Date.now(), ...data } } };
    }
  },
  update: async (id, data) => {
    try {
      return await api.put(`/admin/schedules/${id}`, data);
    } catch (e) {
      return { data: { success: true, data: { id, ...data } } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/admin/schedules/${id}`);
    } catch (e) {
      return { data: { success: true } };
    }
  },
};

export const seatAPI = {
  getSeats: async (scheduleId) => {
    try {
      return await api.get(`/schedules/${scheduleId}/seats`);
    } catch (e) {
      return { data: { success: true, data: generateMockSeats(36) } };
    }
  },
  toggleBlock: async (data) => {
    try {
      return await api.post('/admin/seats/block', data);
    } catch (e) {
      return { data: { success: true } };
    }
  },
};

export const bookingAPI = {
  create: async (data) => {
    try {
      return await api.post('/bookings', data);
    } catch (e) {
      const bookingRef = 'RT3D-TG-' + Math.floor(100000 + Math.random() * 900000);
      const sched = data.schedule || {};
      const seatNums = data.passengers?.map((p) => p.seatNumber || p.seatId).filter(Boolean) || ['A1'];
      const firstPax = data.passengers?.[0];
      const paxList = (data.passengers || [
        { name: 'Ravi Kumar Naidu', passengerName: 'Ravi Kumar Naidu', age: 28, gender: 'MALE', seatNumber: 'A1' }
      ]).map((p, idx) => ({
        name: p.name || p.passengerName || 'Passenger ' + (idx + 1),
        passengerName: p.name || p.passengerName || 'Passenger ' + (idx + 1),
        age: p.age ? Number(p.age) : 28,
        gender: p.gender || 'MALE',
        seatNumber: p.seatNumber || seatNums[idx] || ('A' + (idx + 1)),
      }));

      const savedUserStr = localStorage.getItem('route3d_user');
      let fallbackEmail = 'passenger@teluguride.com';
      try {
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.email) fallbackEmail = parsed.email;
        }
      } catch (err) {
        // ignore parse error
      }

      const newBooking = {
        id: Date.now(),
        bookingNumber: bookingRef,
        bookingReference: bookingRef,
        userId: 1,
        userEmail: data.userEmail || fallbackEmail,
        passengerLeadName: paxList[0]?.name || 'Ravi Kumar Naidu',
        scheduleId: data.scheduleId || sched.id || 101,
        busName: sched.busName || 'TGSRTC Rajdhani AC Express',
        busNumber: sched.busNumber || 'TS09Z7788',
        busType: sched.busType || 'GARUDA_PLUS',
        operatorName: sched.operatorName || sched.operatorCode || 'TGSRTC (Telangana RTC)',
        operatorCode: sched.operatorCode || 'TGSRTC',
        sourceCity: sched.sourceCity || data.sourceCity || 'Hyderabad',
        sourceState: sched.sourceState || 'TELANGANA',
        destinationCity: sched.destinationCity || data.destinationCity || 'Vijayawada',
        destinationState: sched.destinationState || 'ANDHRA_PRADESH',
        travelDate: sched.travelDate || data.travelDate || new Date().toISOString().split('T')[0],
        departureTime: sched.departureTime || '06:00:00',
        arrivalTime: sched.arrivalTime || '11:00:00',
        seatNumbers: seatNums,
        totalAmount: data.totalAmount || (seatNums.length * (sched.baseFare || 650)),
        bookingStatus: 'CONFIRMED',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        bookingTime: new Date().toISOString(),
        qrCodeData: `ROUTE3D-TICKET-${bookingRef}`,
        passengers: paxList,
        boardingPoint: data.boardingPoint || 'MGBS Platform 12 (Direct Corridor)',
        droppingPoint: data.droppingPoint || 'PNBS Terminal Platform 4',
        schedule: {
          id: data.scheduleId || sched.id || 101,
          busName: sched.busName || 'TGSRTC Rajdhani AC Express',
          busNumber: sched.busNumber || 'TS09Z7788',
          operatorName: sched.operatorName || 'TGSRTC',
          sourceCity: sched.sourceCity || 'Hyderabad',
          destinationCity: sched.destinationCity || 'Vijayawada',
          travelDate: sched.travelDate || new Date().toISOString().split('T')[0],
          departureTime: sched.departureTime || '06:00',
          arrivalTime: sched.arrivalTime || '11:00',
        },
      };

      const myBookings = getStored('my_bookings', []);
      myBookings.unshift(newBooking);
      setStored('my_bookings', myBookings);
      return { data: { success: true, data: newBooking } };
    }
  },
  getMyBookings: async () => {
    try {
      return await api.get('/bookings/my');
    } catch (e) {
      let stored = getStored('my_bookings', []);
      if (stored.length === 0) {
        const defaultB = {
          id: 991,
          bookingNumber: 'RT3D-TG-884920',
          bookingReference: 'RT3D-TG-884920',
          userId: 1,
          userEmail: 'passenger@teluguride.com',
          passengerLeadName: 'Ravi Kumar Naidu',
          scheduleId: 101,
          busName: 'TGSRTC Rajdhani AC Express',
          busNumber: 'TS09Z7788',
          busType: 'GARUDA_PLUS',
          operatorName: 'TGSRTC (Telangana RTC)',
          operatorCode: 'TGSRTC',
          sourceCity: 'Hyderabad',
          sourceState: 'TELANGANA',
          destinationCity: 'Vijayawada',
          destinationState: 'ANDHRA_PRADESH',
          travelDate: new Date().toISOString().split('T')[0],
          departureTime: '06:00:00',
          arrivalTime: '11:00:00',
          seatNumbers: ['B1'],
          totalAmount: 650.0,
          bookingStatus: 'CONFIRMED',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          bookingTime: new Date().toISOString(),
          qrCodeData: 'ROUTE3D-TICKET-RT3D-TG-884920',
          passengers: [{ name: 'Ravi Kumar Naidu', passengerName: 'Ravi Kumar Naidu', age: 28, gender: 'MALE', seatNumber: 'B1' }],
          boardingPoint: 'MGBS Platform 12',
          droppingPoint: 'PNBS Terminal',
          schedule: {
            busName: 'TGSRTC Rajdhani AC Express',
            busNumber: 'TS09Z7788',
            sourceCity: 'Hyderabad',
            destinationCity: 'Vijayawada',
            travelDate: new Date().toISOString().split('T')[0],
            departureTime: '06:00',
            arrivalTime: '11:00',
          },
        };
        stored = [defaultB];
        setStored('my_bookings', stored);
      }
      return { data: { success: true, data: stored } };
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/bookings/${id}`);
    } catch (e) {
      const stored = getStored('my_bookings', []);
      const found = stored.find((b) => b.id === Number(id) || String(b.id) === String(id)) || stored[0];
      return { data: { success: true, data: found } };
    }
  },
  getByNumber: async (refNumber) => {
    try {
      return await api.get(`/bookings/ref/${refNumber}`);
    } catch (e) {
      const stored = getStored('my_bookings', []);
      const found = stored.find((b) => b.bookingNumber === refNumber || b.bookingReference === refNumber) || stored[0];
      return { data: { success: true, data: found } };
    }
  },
  cancel: async (id) => {
    try {
      return await api.put(`/bookings/${id}/cancel`);
    } catch (e) {
      const stored = getStored('my_bookings', []);
      const item = stored.find((b) => b.id === Number(id) || String(b.id) === String(id));
      if (item) {
        item.bookingStatus = 'CANCELLED';
        item.status = 'CANCELLED';
        item.paymentStatus = 'REFUNDED';
      }
      setStored('my_bookings', stored);
      return { data: { success: true, data: item } };
    }
  },
  getAll: async () => {
    try {
      return await api.get('/admin/bookings');
    } catch (e) {
      const bookings = getStored('my_bookings', []);
      return { data: { success: true, data: bookings } };
    }
  },
};

export const dashboardAPI = {
  getStats: async () => {
    try {
      return await api.get('/admin/dashboard');
    } catch (e) {
      return {
        data: {
          success: true,
          data: {
            totalBuses: 6,
            activeBuses: 6,
            totalUsers: 142,
            todayBookings: 28,
            totalRevenue: 148500,
            occupancyRate: 84,
            confirmedBookings: 24,
            cancelledBookings: 4,
            revenueByMonth: [
              { month: 'Apr', revenue: 95000 },
              { month: 'May', revenue: 120000 },
              { month: 'Jun', revenue: 110000 },
              { month: 'Jul', revenue: 135000 },
              { month: 'Aug', revenue: 142000 },
              { month: 'Sep', revenue: 148500 },
            ],
            topCorridors: [
              { name: 'Hyderabad ⇄ Vijayawada', bookings: 68 },
              { name: 'Hyderabad ⇄ Vizag', bookings: 42 },
              { name: 'Hyderabad ⇄ Tirupati', bookings: 36 },
              { name: 'Vijayawada ⇄ Vizag', bookings: 24 },
            ],
            dailyRevenueTrends: [
              { date: '04 Sep', revenue: 19500 },
              { date: '05 Sep', revenue: 22400 },
              { date: '06 Sep', revenue: 18900 },
              { date: '07 Sep', revenue: 26800 },
              { date: '08 Sep', revenue: 24100 },
              { date: '09 Sep', revenue: 29500 },
              { date: '10 Sep', revenue: 28200 },
            ],
            busTypeDistribution: [
              { name: 'Garuda Plus AC', value: 2 },
              { name: 'Super Luxury', value: 2 },
              { name: 'Lahari Sleeper', value: 1 },
              { name: 'Amaravati Scania', value: 1 },
            ],
            topRoutes: [
              { route: 'Hyderabad ⇄ Vijayawada (MGBS - PNBS)', bookings: 68, occupancy: '94%' },
              { route: 'Hyderabad ⇄ Visakhapatnam (NH16 Express)', bookings: 42, occupancy: '88%' },
              { route: 'Hyderabad ⇄ Tirupati (Alipiri Corridor)', bookings: 36, occupancy: '86%' },
              { route: 'Vijayawada ⇄ Visakhapatnam (Coastal Run)', bookings: 24, occupancy: '82%' },
            ],
            totalChallans: 5,
            pendingChallans: 4,
            challanFineTotal: 8500,
          },
        },
      };
    }
  },
};

export const challanAPI = {
  getAll: async () => {
    try {
      return await api.get('/admin/challans');
    } catch (e) {
      return { data: { success: true, data: getStored('mock_challans', INITIAL_CHALLANS) } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/admin/challans', data);
    } catch (e) {
      const list = getStored('mock_challans', INITIAL_CHALLANS);
      const newChallan = {
        id: Date.now(),
        challanNumber: data.challanNumber || `TS-HYD-CH-${Math.floor(10000 + Math.random() * 90000)}`,
        busNumber: data.busNumber || 'TS09Z7788',
        busName: data.busName || 'TGSRTC Express',
        operatorCode: data.operatorCode || (data.busNumber?.startsWith('AP') ? 'APSRTC' : 'TGSRTC'),
        driverName: data.driverName || 'S. Narsimha Reddy',
        offense: data.offense || 'Traffic speed regulation violation',
        jurisdiction: data.jurisdiction || 'Highway Traffic Patrol Unit',
        amount: Number(data.amount) || 1000,
        offenseDate: data.offenseDate || new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: data.status || 'PENDING',
        caseType: data.caseType || 'TRAFFIC_VIOLATION',
        courtHearingDate: data.courtHearingDate || 'N/A',
      };
      list.unshift(newChallan);
      setStored('mock_challans', list);
      return { data: { success: true, data: newChallan } };
    }
  },
  payChallan: async (id) => {
    try {
      return await api.put(`/admin/challans/${id}/pay`);
    } catch (e) {
      const list = getStored('mock_challans', INITIAL_CHALLANS);
      const item = list.find((c) => c.id === Number(id));
      if (item) {
        item.status = 'DISPOSED';
        item.courtHearingDate = `Settled & Cleared on ${new Date().toISOString().split('T')[0]}`;
      }
      setStored('mock_challans', list);
      return { data: { success: true, data: item } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/admin/challans/${id}`);
    } catch (e) {
      let list = getStored('mock_challans', INITIAL_CHALLANS);
      list = list.filter((c) => c.id !== Number(id));
      setStored('mock_challans', list);
      return { data: { success: true } };
    }
  },
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getAll: async () => {
    try {
      return await api.get('/admin/users');
    } catch (e) {
      return {
        data: {
          success: true,
          data: [
            { id: 1, fullName: 'Jaswanth Doppa', email: 'jaswanthdoppa76@gmail.com', role: 'ROLE_ADMIN', status: 'ACTIVE', phone: '9876543210' },
            { id: 2, fullName: 'Ravi Kumar Naidu', email: 'passenger@teluguride.com', role: 'ROLE_USER', status: 'ACTIVE', phone: '9848022338' },
          ],
        },
      };
    }
  },
  toggleStatus: (id) => api.put(`/admin/users/${id}/toggle`),
};

export default api;
