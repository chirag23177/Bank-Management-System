INSERT INTO BANK (BankID, BankName, BankMoney, NoOfBranches) VALUES
(01, 'RBI', 500000000.00, 3),
(02, 'Canera Bank', 75000000.00, 2),
(03, 'ICICI Bank', 60000000.00, 1),
(04, 'Axis Bank', 60000000.00, 2);

INSERT INTO BRANCH (BranchAdd, BankID) VALUES
('Shahid Bhagat Singh Road, Mumbai, Maharashtra - 400001', 1),
('6, Sansad Marg, New Delhi, Delhi - 110001', 1),
('15, Netaji Subhas Road, Kolkata, West Bengal - 700001', 1),
('No. 112, J.C. Road, Bengaluru, Karnataka - 560002', 2),
('H-54, Connaught Circus, New Delhi, Delhi - 110001', 2),
('E-7, Ground Floor, Nehru Place, New Delhi, Delhi - 110019', 3),
('Shop No. 1, Ground Floor, Andheri West, Mumbai, Maharashtra - 400058', 4),
('BD-20, Sector-1, Salt Lake City, Kolkata, West Bengal - 700064', 4);

INSERT INTO EMPLOYEE (Name, BranchID) VALUES
('Rajesh Sharma', 1),
('Priya Singh', 1),
('Amit Kumar', 2),
('Neha Gupta', 2),
('Suresh Verma', 3),
('Anita Patel', 3),
('Vijay Reddy', 4),
('Sunita Rao', 4),
('Arun Joshi', 5),
('Kavita Nair', 5),
('Manoj Desai', 6),
('Rashmi Iyer', 6),
('Pankaj Mehta', 7),
('Sneha Chawla', 7),
('Rahul Bhatia', 8),
('Anjali Sinha', 8);

INSERT INTO USERS (Name, Address, MobileNumber) VALUES
('Amit Sharma', '123 MG Road, Bengaluru, Karnataka - 560001', '9876543210'),
('Priya Singh', '456 Park Street, Kolkata, West Bengal - 700016', '9123456789'),
('Rahul Verma', '789 Nehru Place, New Delhi, Delhi - 110019', '9988776655'),
('Anjali Nair', '101 Marine Drive, Mumbai, Maharashtra - 400002', '9765432109'),
('Vikram Patel', '202 Anna Salai, Chennai, Tamil Nadu - 600002', '9898989898'),
('Sneha Gupta', '303 Banjara Hills, Hyderabad, Telangana - 500034', '9876543211'),
('Arjun Reddy', '404 Sector 17, Chandigarh - 160017', '9123456790'),
('Kavita Desai', '505 Connaught Place, New Delhi, Delhi - 110001', '9988776656'),
('Manish Kumar', '606 Juhu Beach, Mumbai, Maharashtra - 400049', '9765432110'),
('Pooja Joshi', '707 Salt Lake, Kolkata, West Bengal - 700091', '9898989899');

INSERT INTO ACCOUNT (AccountNo, Balance, UserID, BranchID) VALUES
(1001, 15000.00, 1, 1),
(1002, 25000.00, 1, 2),
(1003, 30000.00, 2, 3),
(1004, 20000.00, 3, 4),
(1005, 5000.00, 3, 5),
(1006, 12000.00, 3, 6),
(1007, 18000.00, 4, 7),
(1008, 22000.00, 5, 8),
(1009, 8000.00, 5, 1),
(1010, 16000.00, 6, 2),
(1011, 14000.00, 7, 3),
(1012, 9000.00, 7, 4),
(1013, 11000.00, 7, 5),
(1014, 13000.00, 8, 6);

INSERT INTO LOAN (LoanAmount, Duration, Interest, LoanType, IssueDate, UserID, BankID) VALUES
(500000.00, 60, 7.5, 'Home Loan', '2024-01-15', 1, 1),
(200000.00, 36, 8.0, 'Car Loan', '2024-06-20', 1, 1),
(150000.00, 24, 9.0, 'Personal Loan', '2024-03-10', 2, 2),
(300000.00, 48, 7.8, 'Education Loan', '2023-09-05', 3, 3),
(100000.00, 12, 10.0, 'Personal Loan', '2024-02-14', 3, 3),
(250000.00, 36, 8.5, 'Car Loan', '2024-07-22', 3, 3),
(400000.00, 60, 7.2, 'Home Loan', '2023-11-30', 4, 4),
(120000.00, 24, 9.5, 'Personal Loan', '2024-05-18', 5, 2),
(220000.00, 36, 8.3, 'Car Loan', '2024-08-25', 5, 2);

INSERT INTO TRANSACTION_HISTORY (TransactionAmount, TransactionTime, BranchID, AccountNo1, AccountNo2) VALUES
(500.00, '2025-02-01 10:15:00', 1, 1001, 1002),
(1500.00, '2025-02-02 11:00:00', 2, 1002, 1003),
(2000.00, '2025-02-03 09:30:00', 3, 1003, 1004),
(750.00, '2025-02-04 14:45:00', 3, 1003, 1001),
(1200.00, '2025-02-05 16:20:00', 4, 1004, 1005),
(300.00, '2025-02-06 12:10:00', 5, 1005, 1006),
(450.00, '2025-02-07 13:50:00', 6, 1006, 1007),
(800.00, '2025-02-08 15:30:00', 7, 1007, 1008),
(950.00, '2025-02-09 10:05:00', 8, 1008, 1009),
(1100.00, '2025-02-10 11:25:00', 1, 1009, 1010),
(1300.00, '2025-02-11 14:15:00', 2, 1010, 1011),
(700.00, '2025-02-12 09:45:00', 3, 1011, 1012),
(400.00, '2025-02-13 16:35:00', 4, 1012, 1013),
(600.00, '2025-02-14 13:25:00', 5, 1013, 1014),
(550.00, '2025-02-15 12:00:00', 6, 1014, 1001);
