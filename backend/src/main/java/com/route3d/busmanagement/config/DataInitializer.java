package com.route3d.busmanagement.config;

import com.route3d.busmanagement.entity.*;
import com.route3d.busmanagement.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OperatorRepository operatorRepository;
    private final AmenityRepository amenityRepository;
    private final BusRepository busRepository;
    private final SeatRepository seatRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
            OperatorRepository operatorRepository,
            AmenityRepository amenityRepository,
            BusRepository busRepository,
            SeatRepository seatRepository,
            RouteRepository routeRepository,
            ScheduleRepository scheduleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.operatorRepository = operatorRepository;
        this.amenityRepository = amenityRepository;
        this.busRepository = busRepository;
        this.seatRepository = seatRepository;
        this.routeRepository = routeRepository;
        this.scheduleRepository = scheduleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (operatorRepository.count() == 0) {
            seedOperators();
        }
        if (amenityRepository.count() == 0) {
            seedAmenities();
        }
        if (busRepository.count() == 0) {
            seedBuses();
        }
        if (routeRepository.count() == 0) {
            seedRoutes();
        }
        if (scheduleRepository.count() == 0) {
            seedSchedules();
        }
    }

    private void seedUsers() {
        // Default Admin Account
        User admin = new User(
                "Route3D System Admin",
                "jaswanthdoppa76@gmail.com",
                passwordEncoder.encode("jassu143@gmail.com"),
                "9876543210",
                Role.ROLE_ADMIN);
        userRepository.save(admin);

        // Default Demo Customer Account
        User customer = new User(
                "Ravi Kumar Naidu",
                "passenger@teluguride.com",
                passwordEncoder.encode("User@123"),
                "9848022338",
                Role.ROLE_USER);
        userRepository.save(customer);
        System.out.println(">>> Seeded Admin (admin@route3d.com) and Customer (passenger@teluguride.com)");
    }

    private void seedOperators() {
        Operator tgsrtc = new Operator(
                "TGSRTC (Telangana State RTC)",
                "TGSRTC",
                "040-69440000",
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&auto=format&fit=crop");
        operatorRepository.save(tgsrtc);

        Operator apsrtc = new Operator(
                "APSRTC (Andhra Pradesh State RTC)",
                "APSRTC",
                "0866-2570005",
                "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100&auto=format&fit=crop");
        operatorRepository.save(apsrtc);
        System.out.println(">>> Seeded TGSRTC and APSRTC operators");
    }

    private void seedAmenities() {
        List<Amenity> list = Arrays.asList(
                new Amenity("AC", "Snowflake"),
                new Amenity("Charging Point", "BatteryCharging"),
                new Amenity("Water Bottle", "Droplet"),
                new Amenity("Reading Light", "Lamp"),
                new Amenity("Wi-Fi", "Wifi"),
                new Amenity("Push Back Seats", "Armchair"),
                new Amenity("Blanket", "Bed"),
                new Amenity("Live Tracking", "MapPin"));
        amenityRepository.saveAll(list);
        System.out.println(">>> Seeded bus amenities");
    }

    private void seedBuses() {
        Operator tgsrtc = operatorRepository.findByCode("TGSRTC").orElse(null);
        Operator apsrtc = operatorRepository.findByCode("APSRTC").orElse(null);
        List<Amenity> allAmenities = amenityRepository.findAll();

        if (tgsrtc != null) {
            // Bus 1: TGSRTC Rajdhani AC
            Bus b1 = new Bus(tgsrtc, "TS09Z7788", "TGSRTC Rajdhani AC", BusType.GARUDA_PLUS, 36, "SEATER_2X2");
            b1.setAmenities(new HashSet<>(allAmenities.subList(0, 5)));
            saveBusWithSeats(b1);

            // Bus 2: TGSRTC Lahari Sleeper
            Bus b2 = new Bus(tgsrtc, "TS08Z5544", "TGSRTC Lahari Sleeper", BusType.LAHARI_SLEEPER, 30, "SLEEPER_2X1");
            b2.setAmenities(new HashSet<>(allAmenities.subList(0, 6)));
            saveBusWithSeats(b2);

            // Bus 3: TGSRTC Super Luxury
            Bus b3 = new Bus(tgsrtc, "TS07Z3322", "TGSRTC Super Luxury Express", BusType.SUPER_LUXURY, 40,
                    "SEATER_2X2");
            b3.setAmenities(new HashSet<>(allAmenities.subList(5, 7)));
            saveBusWithSeats(b3);
        }

        if (apsrtc != null) {
            // Bus 4: APSRTC Amaravati Scania
            Bus b4 = new Bus(apsrtc, "AP29Z1122", "APSRTC Amaravati Multi-Axle AC", BusType.AMARAVATI, 44,
                    "SEATER_2X2");
            b4.setAmenities(new HashSet<>(allAmenities.subList(0, 6)));
            saveBusWithSeats(b4);

            // Bus 5: APSRTC Dolphin Cruise
            Bus b5 = new Bus(apsrtc, "AP26Z4433", "APSRTC Dolphin Cruise Express", BusType.GARUDA_PLUS, 36,
                    "SEATER_2X2");
            b5.setAmenities(new HashSet<>(allAmenities.subList(0, 5)));
            saveBusWithSeats(b5);

            // Bus 6: APSRTC Vennela Sleeper
            Bus b6 = new Bus(apsrtc, "AP16Z6655", "APSRTC Vennela AC Sleeper", BusType.VENNELA, 30, "SLEEPER_2X1");
            b6.setAmenities(new HashSet<>(allAmenities));
            saveBusWithSeats(b6);
        }
        System.out.println(">>> Seeded official TGSRTC and APSRTC buses with complete seat grids");
    }

    private void saveBusWithSeats(Bus bus) {
        Bus savedBus = busRepository.save(bus);
        int totalSeats = savedBus.getTotalSeats();
        List<Seat> seats = new ArrayList<>();
        char[] rowLetters = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N' };
        int seatsPerRow = "SLEEPER_2X1".equalsIgnoreCase(savedBus.getLayoutType()) ? 3 : 4;
        int rowCount = (int) Math.ceil((double) totalSeats / seatsPerRow);

        int counter = 0;
        for (int r = 0; r < rowCount && counter < totalSeats; r++) {
            char rowChar = rowLetters[r % rowLetters.length];
            for (int c = 1; c <= seatsPerRow && counter < totalSeats; c++) {
                counter++;
                String seatNumber = "" + rowChar + c;
                SeatType type = (c == 1 || c == seatsPerRow) ? SeatType.WINDOW : SeatType.AISLE;
                seats.add(new Seat(savedBus, seatNumber, type, 1, r + 1, c));
            }
        }
        seatRepository.saveAll(seats);
    }

    private void seedRoutes() {
        List<Route> routes = Arrays.asList(
                new Route("Hyderabad", "TELANGANA", "Vijayawada", "ANDHRA_PRADESH", 275.0, 300),
                new Route("Vijayawada", "ANDHRA_PRADESH", "Hyderabad", "TELANGANA", 275.0, 300),
                new Route("Hyderabad", "TELANGANA", "Visakhapatnam", "ANDHRA_PRADESH", 620.0, 660),
                new Route("Visakhapatnam", "ANDHRA_PRADESH", "Hyderabad", "TELANGANA", 620.0, 660),
                new Route("Hyderabad", "TELANGANA", "Tirupati", "ANDHRA_PRADESH", 560.0, 600),
                new Route("Tirupati", "ANDHRA_PRADESH", "Hyderabad", "TELANGANA", 560.0, 600),
                new Route("Hyderabad", "TELANGANA", "Kurnool", "ANDHRA_PRADESH", 215.0, 240),
                new Route("Warangal", "TELANGANA", "Vijayawada", "ANDHRA_PRADESH", 245.0, 270),
                new Route("Karimnagar", "TELANGANA", "Vijayawada", "ANDHRA_PRADESH", 315.0, 360),
                new Route("Vijayawada", "ANDHRA_PRADESH", "Visakhapatnam", "ANDHRA_PRADESH", 350.0, 360),
                new Route("Vijayawada", "ANDHRA_PRADESH", "Tirupati", "ANDHRA_PRADESH", 430.0, 450));
        routeRepository.saveAll(routes);
        System.out.println(">>> Seeded 11 verified Telangana & Andhra Pradesh routes");
    }

    private void seedSchedules() {
        List<Bus> buses = busRepository.findAll();
        List<Route> routes = routeRepository.findAll();

        if (buses.isEmpty() || routes.isEmpty())
            return;

        LocalDate today = LocalDate.now();
        List<Schedule> schedules = new ArrayList<>();

        // Generate schedules for next 30 days
        for (int dayOffset = 0; dayOffset < 30; dayOffset++) {
            LocalDate travelDate = today.plusDays(dayOffset);

            for (Route route : routes) {
                // Hyderabad to Vijayawada multiple services
                if ("Hyderabad".equalsIgnoreCase(route.getSourceCity())
                        && "Vijayawada".equalsIgnoreCase(route.getDestinationCity())) {
                    schedules.add(new Schedule(buses.get(0), route, travelDate, LocalTime.of(6, 0), LocalTime.of(11, 0),
                            new BigDecimal("650.00")));
                    schedules.add(new Schedule(buses.get(2), route, travelDate, LocalTime.of(10, 30),
                            LocalTime.of(15, 30), new BigDecimal("490.00")));
                    schedules.add(new Schedule(buses.get(3), route, travelDate, LocalTime.of(14, 0),
                            LocalTime.of(19, 0), new BigDecimal("720.00")));
                    schedules.add(new Schedule(buses.get(1), route, travelDate, LocalTime.of(23, 0),
                            LocalTime.of(4, 30), new BigDecimal("890.00")));
                }

                // Vijayawada to Hyderabad return services
                if ("Vijayawada".equalsIgnoreCase(route.getSourceCity())
                        && "Hyderabad".equalsIgnoreCase(route.getDestinationCity())) {
                    schedules.add(new Schedule(buses.get(3), route, travelDate, LocalTime.of(7, 30),
                            LocalTime.of(12, 30), new BigDecimal("720.00")));
                    schedules.add(new Schedule(buses.get(0), route, travelDate, LocalTime.of(16, 0),
                            LocalTime.of(21, 0), new BigDecimal("650.00")));
                    schedules.add(new Schedule(buses.get(1), route, travelDate, LocalTime.of(22, 30),
                            LocalTime.of(4, 0), new BigDecimal("890.00")));
                }

                // Hyderabad to Visakhapatnam
                if ("Hyderabad".equalsIgnoreCase(route.getSourceCity())
                        && "Visakhapatnam".equalsIgnoreCase(route.getDestinationCity())) {
                    schedules.add(new Schedule(buses.get(3), route, travelDate, LocalTime.of(18, 30),
                            LocalTime.of(6, 0), new BigDecimal("1250.00")));
                    schedules.add(new Schedule(buses.get(5), route, travelDate, LocalTime.of(20, 0),
                            LocalTime.of(7, 30), new BigDecimal("1450.00")));
                }

                // Hyderabad to Tirupati
                if ("Hyderabad".equalsIgnoreCase(route.getSourceCity())
                        && "Tirupati".equalsIgnoreCase(route.getDestinationCity())) {
                    schedules.add(new Schedule(buses.get(4), route, travelDate, LocalTime.of(19, 0),
                            LocalTime.of(5, 30), new BigDecimal("1100.00")));
                    schedules.add(new Schedule(buses.get(2), route, travelDate, LocalTime.of(21, 0), LocalTime.of(8, 0),
                            new BigDecimal("850.00")));
                }
            }
        }

        scheduleRepository.saveAll(schedules);
        System.out.println(">>> Seeded schedules across 30 days for AP & Telangana corridors");
    }
}
