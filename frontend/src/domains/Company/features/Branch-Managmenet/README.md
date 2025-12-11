# Branch Management - Complete

## Files: 24 files

```
Config/
  branchConfig.js
Models/
  BranchIncident.js
  BranchZone.js
Services/
  IBranchDataSource.js
  BranchMockService.js
  BranchAPIService.js
Mappers/
  branchDataMapper.js
  branchMarkerMapper.js
  branchCircleMapper.js
Hooks/
  useBranchData.js
Components/
  BranchMap/
    BranchMap.jsx
    BranchMap.css
  BranchMarker/
    BranchMarker.jsx
    BranchMarker.css
    branchMarker.factory.jsx
    icons/
      RetailIcon.jsx
      WarehouseIcon.jsx
      FactoryIcon.jsx
      OfficeIcon.jsx
      DefaultBranchIcon.jsx
  BranchCircle/
    BranchCircle.jsx
  BranchPopUp/
    BranchPopUp.jsx
    BranchPopUp.css
mock/
  branches.json
```

## Usage

```jsx
import { BranchMap } from '@/domains/Company/features/BranchManagement';

function App() {
  return <BranchMap />;
}
```

## Setup

1. Copy folder to: `src/domains/Company/features/BranchManagement`
2. Copy `mock/branches.json` to: `public/mock/branches.json`
3. Import and use

## API Format

Backend cần trả về:

```json
{
  "branches": [
    {
      "id": "branch_001",
      "branchName": "Chi nhánh Quận 1",
      "branchType": "RETAIL",
      "performanceLevel": "EXCELLENT",
      "lat": 10.77,
      "lng": 106.7,
      "manager": "Nguyễn Văn A",
      "employeeCount": 15,
      "monthlyRevenue": 500000000,
      "monthlyExpense": 300000000,
      "monthlyProfit": 200000000,
      "inventoryValue": 150000000,
      "inventoryCount": 1250,
      "address": "123 Nguyễn Huệ, Q.1"
    }
  ]
}
```

## Done!
