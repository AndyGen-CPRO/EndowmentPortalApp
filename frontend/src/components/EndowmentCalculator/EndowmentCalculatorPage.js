import React, { useEffect, useState } from "react";

const EndowmentCalculator = () => {
  const [pledgePeriod, setPledgePeriod] = useState(5);
  const [displayGrowth, setDisplayGrowth] = useState(5);
  const [donationType, setDonationType] = useState("fixed");
  const [annualAmount, setAnnualAmount] = useState(10000);
  const [customAmounts, setCustomAmounts] = useState([]);
  const [results, setResults] = useState([]);

  const roiPercentage = 8;
  const disbursementFee = 5;
  const adminFee = 2.15;

  useEffect(() => {
    if (donationType === "custom") {
      const initialCustomAmounts = Array.from({ length: pledgePeriod }, (_, i) => customAmounts[i] || annualAmount);
      setCustomAmounts(initialCustomAmounts);
    }
  }, [pledgePeriod, donationType]);

  useEffect(() => {
    calculateEndowment();
  }, [pledgePeriod, displayGrowth, donationType, annualAmount, customAmounts]);

  const handleAnnualAmountChange = (e) => {
    const value = parseInt(e.target.value.replace(/\D/g, "")) || 0;
    setAnnualAmount(value);
  };

  const handleCustomAmountChange = (index, value) => {
    const newAmounts = [...customAmounts];
    newAmounts[index] = parseInt(value.replace(/\D/g, "")) || 0;
    setCustomAmounts(newAmounts);
  };

  const calculateEndowment = () => {
    let balance = 0;
    let results = [];
    const donationAmounts = donationType === "custom" ? customAmounts.slice(0, pledgePeriod) : Array(pledgePeriod).fill(annualAmount);

    for (let year = 1; year <= displayGrowth; year++) {
      if (year === 1) {
        const firstDonation = donationAmounts[0] || 0;
        results.push({ year, balance: firstDonation.toFixed(2), donationImpact: 0 });
        balance += firstDonation;
        continue;
      }

      const generatedIncome = (balance * roiPercentage) / 100;
      const disbursement = (balance * disbursementFee) / 100;
      const adminCost = (balance * adminFee) / 100;

      const yearBalance = generatedIncome - (disbursement + adminCost);
      balance += yearBalance;

      if (year <= pledgePeriod) {
        balance += donationAmounts[year - 1] || 0;
      }

      results.push({
        year,
        balance: balance.toFixed(2),
        donationImpact: disbursement.toFixed(2),
      });
    }

    setResults(results);
  };

  const generateReport = () => {
    const totalPledgeAmount = (donationType === "custom" ? customAmounts.slice(0, pledgePeriod).reduce((sum, val) => sum + val, 0) : annualAmount * pledgePeriod).toLocaleString();
    const displayAnnualAmount = annualAmount.toLocaleString();

    return (
      <div className="calculation-report">
        <h3>Endowment Calculation Report</h3>
        <p>Endowing a donation of ${totalPledgeAmount} over a {pledgePeriod}-year period can be seen in the illustration below.</p>
        <ul>
          <li>
            The ${totalPledgeAmount} commitment is made up of {pledgePeriod} {donationType === "fixed" ? `fixed annual payment(s) of $${displayAnnualAmount}` : "custom annual payment(s)"}.
          </li>
          <li>Your donation will be invested with an approximate rate of return of {roiPercentage}% (not guaranteed).</li>
          <li>Approximately {disbursementFee}% will be available for disbursement to a qualified donee (charity of choice).</li>
          <li>After annual fees, the remaining investment income will be reinvested.</li>
          <li>Numbers are projections and not financial advice.</li>
        </ul>
      </div>
    );
  };

  const displayResults = () => {
    return [5, 10, 15, 20, 25]
      .filter((years) => displayGrowth >= years)
      .map((years) => {
        const yearResults = results.filter((r) => r.year > years - 5 && r.year <= years);
        return (
          <div key={years}>
            <h4>{years} Year Growth</h4>
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Impact of Donation</th>
                </tr>
              </thead>
              <tbody>
                {yearResults.map((r) => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>${r.balance}</td>
                    <td>${r.donationImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      });
  };

  return (
    <div className="container">
      <h1>Endowment Calculator</h1>
      <div class="form-description">
        <p>
            You can support the Community Foundation of Central Alberta, your community or charity of choice by establishing an 
            endowment fund. With the initial investment untouched, you will have the satisfaction of knowing that your gift 
            will continue giving for many years. Use the calculator below to see the impact your gift can have over time!
        </p>
        <p>
            To assist you in taking the next step, please contact your accountant, lawyer, financial advisor or the Community Foundation of Central Alberta at (403) 341-6911. 
            Please remember these are only projections and should be taken as guarantees or financial advice.  
        </p>
      </div>
      <div className="form-content">
        <div className="endowment-form">
          <div className="form-div">
            <label className="form-label">Pledge Period:</label>
            <select value={pledgePeriod} onChange={(e) => setPledgePeriod(parseInt(e.target.value))}>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Year{i + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-div">
            <label className="form-label">Annual Donation Amount:</label>
            <div>
              <div className="radio-input">
                <input type="radio" value="fixed" checked={donationType === "fixed"} onChange={() => setDonationType("fixed")} />
                <span>Fixed Annual Donation</span>
              </div>
              <div className="radio-input">
                <input type="radio" value="custom" checked={donationType === "custom"} onChange={() => setDonationType("custom")} />
                <span>Custom Annual Donation</span>
              </div>
            </div>
            {donationType === "fixed" ? (
              <div>
                <input type="text" value={`$${annualAmount.toLocaleString()}`} onChange={handleAnnualAmountChange} />
              </div>
            ) : (
              <div>
                {customAmounts.map((amount, index) => (
                  <div key={index}>
                    <label>Year {index + 1}:</label>
                    <input
                      type="text"
                      value={`$${(amount || 0).toLocaleString()}`}
                      onChange={(e) => handleCustomAmountChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-div">
            <label className="form-label">Investment Return Percentage (%): 
              <span class="tooltip">
                  &#9432;
                  <span class="investment-tooltip">
                      Assumed market rate of return based on projections only (not guaranteed).
                  </span>
              </span>
            </label>
            <span>{roiPercentage}%</span>
          </div>

          <div className="form-div">
            <label className="form-label">Disbursement Amount (%):</label>
            <span>{disbursementFee}%</span>
          </div>

          <div className="form-div">
            <label className="form-label">Fees (%): 
              <span class="tooltip">
                    &#9432;
                    <span class="fee-tooltip">
                        Fees include a 1.65% administration fee and a 0.49% investment management fee
                    </span>
                </span>
            </label>
            <span>{adminFee}%</span>
          </div>

          <div className="form-div">
            <label className="form-label">Display Growth Over:</label>
            <select value={displayGrowth} onChange={(e) => setDisplayGrowth(parseInt(e.target.value))}>
              {[5, 10, 15, 20, 25].map((val) => (
                <option key={val} value={val}>
                  {val} Years
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="endowment-result">
          {generateReport()}
          <h3>Endowment Growth</h3>
          {displayResults()}
        </div>
      </div>
    </div>
  );
};

export default EndowmentCalculator;
