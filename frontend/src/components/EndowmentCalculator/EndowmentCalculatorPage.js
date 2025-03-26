import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function EndowmentCalculator() {
  const [annualAmount, setAnnualAmount] = useState(10000);
  const [pledgePeriod, setPledgePeriod] = useState(5);
  const [roiPercentage, setRoiPercentage] = useState(7);
  const [displayGrowth, setDisplayGrowth] = useState(5);
  const [fullResult, setFullResult] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const disbursementFee = 4;
  const adminFee = 2;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedResults = localStorage.getItem("savedEndowmentResults");
  
    if (location.state) {
      setAnnualAmount(location.state.annualAmount);
      setPledgePeriod(location.state.pledgePeriod);
      setDisplayGrowth(5); // or customize from location.state if needed
  
      // 💡 Calculate right after receiving data
      setTimeout(() => calculateEndowment(), 0);
      setShowResult(true);
    } else if (savedResults) {
      // If no state, try loading from saved history
      setFullResult(JSON.parse(savedResults));
      setAnnualAmount(Number(localStorage.getItem("savedAnnualAmount")));
      setPledgePeriod(Number(localStorage.getItem("savedPledgePeriod")));
      setDisplayGrowth(Number(localStorage.getItem("savedDisplayGrowth")) || 5);
      setShowResult(true);
    }
  }, [location.state]);
  
  

  const displayPledgeAmount = (annualAmount * pledgePeriod).toLocaleString(undefined, { maximumFractionDigits: 0 });
  const displayAnnualAmount = annualAmount.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const calculateEndowment = () => {
    let balance = 0;
    let results = [];

    for (let year = 1; year <= displayGrowth; year++) {
      if (year === 1) {
        results.push({
          year,
          balance: annualAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          donationImpact: "0.00"
        });
        balance += annualAmount;
        continue;
      }

      let generatedIncome = (balance * roiPercentage) / 100;
      let calculatedDisbursement = (balance * disbursementFee) / 100;
      let calculatedAdminFee = (balance * adminFee) / 100;
      let yearBalance = generatedIncome - (calculatedDisbursement + calculatedAdminFee);
      balance += yearBalance;

      if (year <= pledgePeriod) {
        balance += annualAmount;
      }

      results.push({
        year,
        balance: balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        donationImpact: calculatedDisbursement.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      });
    }

    setFullResult(results);
    setShowResult(true);
   // 💾 Save full results for display after login
localStorage.setItem("savedEndowmentResults", JSON.stringify(results));
localStorage.setItem("savedAnnualAmount", annualAmount);
localStorage.setItem("savedPledgePeriod", pledgePeriod);
localStorage.setItem("savedDisplayGrowth", displayGrowth);
  };

  return (
    <div className="App">
      <h1>Welcome to the CFCAB Endowment Calculator</h1>
      <p>Use this calculator to determine your endowment contributions and see the impact of your donation.</p>

      <button onClick={() => navigate(-1)} className="back-button">⬅ Go Back</button>

      <div className="endowment-form">
        <div>
          <label>Annual Donation Amount:</label>
          <button onClick={() => setAnnualAmount(annualAmount - 5000)}>-</button>
          <input
            type="text"
            value={`$${annualAmount} CDN`}
            onChange={(e) => setAnnualAmount(Number(e.target.value.replace(/\D/g, "")))}
            required
          />
          <button onClick={() => setAnnualAmount(annualAmount + 5000)}>+</button>
        </div>

        <div>
          <label>Pledge Period (Years):</label>
          <select value={pledgePeriod} onChange={(e) => setPledgePeriod(Number(e.target.value))} required>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} Year{ i + 1 > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <label>ROI Percentage (%):</label>
          <input type="text" value={`${roiPercentage}%`} disabled />
        </div>

        <div>
          <label>Fixed Disbursement (%):</label>
          <input type="text" value={`${disbursementFee}%`} disabled />
        </div>

        <div>
          <label>Admin Fee (%):</label>
          <input type="text" value={`${adminFee}%`} disabled />
        </div>

        <div>
          <label>Display Growth Over:</label>
          <select value={displayGrowth} onChange={(e) => setDisplayGrowth(Number(e.target.value))} required>
            {[5, 10, 15, 20, 25].map(years => (
              <option key={years} value={years}>{years} Years</option>
            ))}
          </select>
        </div>

        <button className="calculate-button" onClick={calculateEndowment}>Calculate</button>
      </div>

      {showResult && (
        <div className="result-table">
          <h3>Endowment Growth Report ({displayGrowth} Years)</h3>
          <p>
    Endowing a donation of <strong>${displayPledgeAmount}</strong> over a <strong>{pledgePeriod}-year</strong> period can be seen in the illustration below.
  </p>
  <ul>
    <li>
      The <strong>${displayPledgeAmount}</strong> commitment is made up of <strong>{pledgePeriod}</strong> fixed annual payment(s) of <strong>${displayAnnualAmount}</strong>.
    </li>
    <li>
      Your donation will be invested with an approximate rate of return of <strong>{roiPercentage}%</strong> <em>(not guaranteed)</em>.
    </li>
    <li>
      Approximately <strong>{disbursementFee}%</strong> will be available for disbursement to a qualified donee (charity of choice). The endowment calculator shows the continued impact of the donation.
    </li>
    <li>
      After annual fees have been deducted, the remaining investment income will be reinvested into the fund as a preservation of capital.
    </li>
    <li>
      <strong>Numbers below are projections only and should not be taken as guarantees or financial advice.</strong>
    </li>
  </ul>
    {/** Loop through 5-year segments and render each table */}
    {[5, 10, 15, 20, 25].map((range) =>
      displayGrowth >= range ? (
        <div key={range} className="result-table">
          <h4>{range} Year Growth</h4>
          <p><strong>Total Pledge:</strong> ${displayPledgeAmount}</p>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Balance</th>
                <th>Impact of Donation</th>
              </tr>
            </thead>
            <tbody>
              {fullResult
                .filter(
                  (result) =>
                    result.year > range - 5 && result.year <= range
                )
                .map((result) => (
                  <tr key={result.year}>
                    <td>{result.year}</td>
                    <td>${result.balance}</td>
                    <td>${result.donationImpact}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          </div>
      ) : null
    )}
        </div>
      )}
    </div>
  );
}

export default EndowmentCalculator;