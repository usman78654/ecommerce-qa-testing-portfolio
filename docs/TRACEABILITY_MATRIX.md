# Requirements Traceability Matrix

| Requirement | Manual cases | API requests / checks | Status |
| --- | --- | --- | --- |
| AUTH-01 | TC-AUTH-001 to 004 | Register User, Duplicate Registration | Designed |
| AUTH-02 | TC-AUTH-005 | Customer Login, Admin Login | Designed |
| AUTH-03 | TC-AUTH-006 | Invalid Login | Designed |
| AUTH-04 | TC-AUTH-007 | Logout, Profile After Logout | Designed |
| AUTH-05 | TC-AUTH-008 | Get Profile | Designed |
| CAT-01 | TC-CAT-001, 002 | List Products, Invalid Page Boundary | Designed |
| CAT-02 | TC-CAT-003 to 005 | Search Products, No-result Search | Designed |
| CAT-03 | TC-CAT-006 | Get Product by ID | Designed |
| CAT-04 | TC-CAT-007 | Source/UI validation | Designed |
| REV-01 | TC-REV-001, 002 | Add Review, Duplicate Review | Designed |
| CART-01 | TC-CART-001, 002 | UI only | Designed |
| CART-02 | TC-CART-003, 004 | UI only | Designed |
| CART-03 | TC-CART-005, 006; TC-ORD-006 | Create Order price assertions | Partially executed; BUG-003 |
| CART-04 | TC-CART-007, 008 | UI/localStorage only | Designed |
| CHK-01 | TC-CHK-001 | Unauthorized Create Order | Designed |
| CHK-02 | TC-CHK-002, 003 | Missing Shipping Field | Designed |
| CHK-03 | TC-CHK-004 | Create Order | Designed |
| ORD-01 | TC-ORD-001, 002 | Create Order, Empty Order | Designed |
| ORD-02 | TC-ORD-003 | Tampered Price Order | Designed |
| ORD-03 | TC-ORD-004, 005 | My Orders, Get Order | Designed |
| ADM-01 | TC-ADM-001 to 003 | Customer Admin Access, Admin Lists | Designed |
| ADM-02 | TC-ADM-004 | Create/Update/Delete Product | Designed |
| ADM-03 | TC-ADM-005 | List Users | Designed |
| ADM-04 | TC-ADM-006 | List Orders, Deliver Order | Designed |
| UX-01 | TC-UX-001, 002 | N/A | Designed |
| ERR-01 | TC-API-001, 002 | Invalid IDs and unauthorized checks | Designed |

Update `Status` to Executed only when linked results and evidence are present.
