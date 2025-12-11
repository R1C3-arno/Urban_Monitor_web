/**
 * Code to ADD to BranchPopUp.jsx (existing file)
 *
 * Location: After financial info section (line ~75)
 * Just copy-paste the function and HTML snippet below
 */

// ============================================
// ADD THIS FUNCTION INSIDE BranchPopUp component
// ============================================

// Fetch Method1 data
const fetchMethod1Data = async (branchId) => {
    try {
        const response = await fetch(`/api/company/method1/branches/${branchId}/latest`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching Method1 data:', error);
        return null;
    }
};

// ============================================
// ADD THIS HTML TO popupContent (after financial section)
// ============================================

// In the popupContent string, add this:

const method1Section = `
  <div class="branch-popup-section">
    <h4 class="branch-popup-section-title">Method1 Optimization</h4>
    <div class="branch-popup-row">
      <span class="branch-popup-label">Total Cost:</span>
      <span class="branch-popup-value">${method1Data ? method1Data.tc.toFixed(2) : 'N/A'}</span>
    </div>
    <div class="branch-popup-row">
      <span class="branch-popup-label">Lot Size (Q):</span>
      <span class="branch-popup-value">${method1Data ? method1Data.q.toFixed(2) : 'N/A'}</span>
    </div>
    <div class="branch-popup-row">
      <span class="branch-popup-label">Production Rate (P):</span>
      <span class="branch-popup-value">${method1Data ? method1Data.p.toFixed(2) : 'N/A'}</span>
    </div>
    <div class="branch-popup-row">
      <span class="branch-popup-label">Safety Factor (K1):</span>
      <span class="branch-popup-value">${method1Data ? method1Data.k1.toFixed(4) : 'N/A'}</span>
    </div>
  </div>
`;

// ============================================
// COMPLETE EXAMPLE (simplified)
// ============================================

// OLD: Just put this INSIDE the useEffect in BranchPopUp.jsx

useEffect(() => {
    if (!map || !branch) return;

    const setupPopup = async () => {
        // Fetch Method1 data
        const method1Data = await fetchMethod1Data(branch.id);

        const popupContent = `
      <div class="branch-popup">
        ${branch.image ? `<img src="${branch.image}" alt="${branch.branchName}" class="branch-popup-image" />` : ''}
        <div class="branch-popup-content">
          <h3>${branch.branchName}</h3>
          
          <!-- ... existing financial info ... -->
          
          <!-- ADD THIS: Method1 Optimization -->
          <div class="branch-popup-section">
            <h4>Method1 Optimization</h4>
            <div class="branch-popup-row">
              <span class="branch-popup-label">Total Cost:</span>
              <span class="branch-popup-value">${method1Data ? method1Data.tc.toFixed(2) : 'N/A'}</span>
            </div>
            <div class="branch-popup-row">
              <span class="branch-popup-label">Lot Size (Q):</span>
              <span class="branch-popup-value">${method1Data ? method1Data.q.toFixed(2) : 'N/A'}</span>
            </div>
            <div class="branch-popup-row">
              <span class="branch-popup-label">Production (P):</span>
              <span class="branch-popup-value">${method1Data ? method1Data.p.toFixed(2) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    `;

        // Create popup (existing code)
        new maptilersdk.Popup()
            .setLngLat([branch.longitude, branch.latitude])
            .setHTML(popupContent)
            .addTo(map);
    };

    setupPopup();
}, [map, branch]);