export const PERMISSION_MODULES = [
    {
        key: "dashboards",
        label: "Dashboards",
        resources: [
            { key: "dashboard_main", label: "Main Dashboard" },
            { key: "dashboard_ops", label: "Operations Dashboard" },
            { key: "dashboard_partner", label: "Partner Performance" },
            { key: "dashboard_finance", label: "Financial Overview" },
            { key: "dashboard_gst", label: "GST Compliance" },
        ],
    },
    {
        key: "booking_orders",
        label: "Booking & Orders",
        resources: [
            { key: "order_create", label: "Create Booking" },
            { key: "order_all", label: "All Orders" },
            { key: "order_pending", label: "Pending Pickups" },
            { key: "order_transit", label: "In Transit" },
            { key: "order_ofd", label: "Out for Delivery" },
            { key: "order_delivered", label: "Delivered" },
            { key: "order_exception", label: "Exceptions" },
            { key: "order_quick", label: "Quick Booking" },
        ],
    },
    {
        key: "awb",
        label: "AWB Management",
        resources: [
            { key: "awb_series", label: "AWB Series" },
            { key: "awb_allocation", label: "Allocation" },
            { key: "awb_usage", label: "Usage Report" },
        ],
    },
    {
        key: "tracking_pod",
        label: "Tracking & POD",
        resources: [
            { key: "tracking_live", label: "Live Tracking" },
            { key: "pod_capture", label: "POD Capture" },
            { key: "pod_verify", label: "POD Verification" },
            { key: "pod_missing", label: "Missing POD" },
            { key: "pod_digital", label: "Digital Signatures" },
        ],
    },
    {
        key: "drs",
        label: "Delivery Run Sheet",
        resources: [
            { key: "drs_create", label: "Create DRS" },
            { key: "drs_active", label: "Active DRS" },
            { key: "drs_history", label: "DRS History" },
            { key: "drs_cust_portal", label: "Customer Tracking Portal" },
        ],
    },
    {
        key: "manifest",
        label: "Manifest Management",
        resources: [
            // Counter Manifest
            { key: "manifest_counter", label: "Counter: Send Shipments" },
            { key: "manifest_inward", label: "Counter: Inward Processing" },
            // { key: "manifest_bulk", label: "Counter: Bulk Inward" },
            // { key: "manifest_weight", label: "Counter: Weight Updates" },
            // Forwarding Manifest
            { key: "manifest_create", label: "Forwarding: Create Manifest" },
            { key: "manifest_bag", label: "Forwarding: Bag Tag Management" },
            { key: "manifest_dispatch", label: "Forwarding: Dispatch Console" },
            { key: "manifest_history", label: "Forwarding: Manifest History" },
        ],
    },
    {
        key: "branch_mgmt",
        label: "Branch Management",
        resources: [
            { key: "branch_all", label: "All Branches" },
            { key: "branch_add", label: "Add Branch" },
            { key: "branch_perf", label: "Branch Performance" },
            { key: "branch_service", label: "Service Areas" },
        ],
    },
    {
        key: "warehouse",
        label: "Warehouse Operations",
        resources: [
            { key: "wh_inventory", label: "Inventory Management" },
            { key: "wh_stock", label: "Stock Reconciliation" },
            { key: "wh_assets", label: "Asset Tracking" },
        ],
    },
    {
        key: "partner_mgmt",
        label: "Partner Management",
        resources: [
            { key: "partner_all", label: "All Partners" },
            { key: "partner_onboard", label: "Partner Onboarding" },
            { key: "partner_score", label: "Performance Scorecards" },
            { key: "partner_settle", label: "Settlement Dashboard" },
        ],
    },
    {
        key: "vendor_mgmt",
        label: "Vendor Management",
        resources: [
            { key: "vendor_coload", label: "Co-loading Partners" },
            { key: "vendor_service", label: "Service Partners" },
            { key: "vendor_metrics", label: "Performance Metrics" },
        ],
    },
    {
        key: "customer_mgmt",
        label: "Customer Management",
        resources: [
            { key: "cust_directory", label: "Customer Directory" },
            { key: "cust_onboard", label: "Customer Onboarding" },
            { key: "cust_agreement", label: "Service Agreements" },
            { key: "cust_ticket", label: "Support Tickets" },
            { key: "cust_pickup", label: "Pickup Requests" },
        ],
    },
    {
        key: "finance_gst",
        label: "Financial & GST",
        resources: [
            // Invoicing
            { key: "fin_invoice_gen", label: "Generate Invoice" },
            { key: "fin_invoice_hist", label: "Invoice History" },
            { key: "fin_notes", label: "Credit/Debit Notes" },
            // GST Compliance
            { key: "fin_gst_report", label: "GSTR Reports" },
            { key: "fin_eway", label: "E-Way Bills" },
            { key: "fin_tax", label: "Tax Calculations" },
            // Billing & Payments
            { key: "fin_pay_coll", label: "Payment Collection" },
            { key: "fin_cod", label: "COD Management" },
            { key: "fin_settle", label: "Settlement Reports" },
            { key: "fin_tally", label: "Tally Integration" },
        ],
    },
    {
        key: "operations_mgmt",
        label: "Operations",
        resources: [
            // Rider Management
            { key: "op_rider_alloc", label: "Rider Allocation" },
            { key: "op_rider_perf", label: "Performance Tracking" },
            { key: "op_rider_shift", label: "Attendance & Shifts" },
            // Exception Handling
            { key: "op_ex_pending", label: "Pending Exceptions" },
            { key: "op_ex_flow", label: "Exception Workflow" },
            { key: "op_ex_rca", label: "Root Cause Analysis" },
            { key: "op_ex_qc", label: "Quality Control" },
        ],
    },
    {
        key: "reports",
        label: "Reports & Analytics",
        resources: [
            // Operational Reports
            { key: "rep_del_perf", label: "Delivery Performance" },
            { key: "rep_part_perf", label: "Partner Performance" },
            { key: "rep_branch_perf", label: "Branch Performance" },
            { key: "rep_rider_perf", label: "Rider Performance" },
            // Financial Reports
            { key: "rep_rev", label: "Revenue Reports" },
            { key: "rep_gst", label: "GST Compliance" },
            { key: "rep_settle", label: "Settlement Reports" },
            { key: "rep_bi", label: "Business Intelligence" },
        ],
    },
    {
        key: "master_data",
        label: "Master Data",
        resources: [
            { key: "master_cust", label: "Customer Master" },
            { key: "master_loc", label: "Location Master" },
            { key: "master_veh", label: "Vehicle Master" },
            { key: "master_driver", label: "Driver Master" },
            { key: "master_route", label: "Route Master" },
            { key: "master_pin", label: "Pincode Serviceability" },
            { key: "master_rate", label: "Rates" },
            { key: "master_prod", label: "Product & Services" },
            { key: "master_config", label: "System Configuration" },
        ],
    },
    {
        key: "system_admin",
        label: "System Admin",
        resources: [
            { key: "sys_users", label: "User Management" },
            { key: "sys_roles", label: "User Roles" },
            { key: "sys_perms", label: "Permissions" },
            { key: "sys_audit", label: "Audit Logs" },
            { key: "sys_settings", label: "System Settings" },
            { key: "sys_int", label: "Integration Management" },
        ],
    },
];
