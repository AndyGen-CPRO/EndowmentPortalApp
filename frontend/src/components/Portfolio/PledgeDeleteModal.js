const PledgeDelete = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div>
                    <h2>Confirm Deletion</h2>
                    <p>Are you sure you want to delete this Endowment Pledge?</p>
                    <p>This action cannot be <strong>undone.</strong></p>

                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    )
}

export default PledgeDelete