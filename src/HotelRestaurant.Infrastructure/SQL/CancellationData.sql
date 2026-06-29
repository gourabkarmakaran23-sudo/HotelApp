INSERT INTO "RefundRecords" 
("BookingId", "GuestName", "RefundAmount", "Status", "IsDeleted", "BookingSource", "RequestDate", "Remarks", "BankName", "AccountNo", "IfscCode", "ProcessStatus", "RefundChannel", "TransactionId", "RefundedDate")
VALUES
-- Stage: Due (Status = 0)
('BK-2026-8841', 'Anisur Rahman', 4500.00, 0, false, 'Walk-In', '2026-06-25', 'Guest cancelled due to medical emergency', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BK-2026-0912', 'Subrata Das', 7200.00, 0, false, 'Booking.com', '2026-06-27', 'Flight cancelled, non-website group booking', NULL, NULL, NULL, NULL, NULL, NULL, NULL),

-- Stage: Under Process (Status = 1)
('BK-2026-7712', 'Rokeya Begum', 3200.00, 1, false, NULL, NULL, NULL, 'State Bank of India', '33214569871', 'SBIN0004122', 'Sent to Accounts', NULL, NULL, NULL),
('BK-2026-1150', 'Tanvir Ahmed', 8900.00, 1, false, NULL, NULL, NULL, 'HDFC Bank', '5010043219882', 'HDFC0000181', 'Awaiting GM Approval', NULL, NULL, NULL),

-- Stage: Refunded Archive (Status = 2)
('BK-2026-5501', 'Kazi Imran', 5000.00, 2, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'UPI / GPay', 'UTR606291142511', '2026-06-20'),
('BK-2026-9013', 'Md. Mezbaul', 2500.00, 2, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Cash', 'CASH-CHQ-992140', '2026-06-28');