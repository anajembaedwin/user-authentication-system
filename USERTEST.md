Here are 5 sample requests for registering users that you can use to test the `/register` and subsequent endpoints:

---

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securePassword123", 
  "or password": "newpassword123"
}
```

### **Sample 1: Regular User**
**Body**:
```json
{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "password123"
}
```

---

### **Sample 2: Admin User**
**Body**:
```json
{
    "name": "Admin User",
    "email": "admin.user@example.com",
    "password": "adminPass@456"
}
```

*Note*: If you're assigning roles manually in the database, update the role to `admin` for this user later.

---

### **Sample 3: Another Regular User**
**Body**:
```json
{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "password": "securePass789"
}
```

---

### **Sample 4: Edge Case - Long Name**
**Body**:
```json
{
    "name": "This Is A Very Long Name That Might Test The Limits Of The Database Field",
    "email": "long.name@example.com",
    "password": "longNamePass!123"
}
```

---

### **Sample 5: Edge Case - Short Password**
**Body**:
```json
{
    "name": "Short Pass User",
    "email": "short.pass@example.com",
    "password": "12345"
}
```

---