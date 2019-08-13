import React from "react";

export const noRecordsAvailable = (message, styling) => {
    return (
        <div>
            <p className="text-center">{message}</p>
        </div>
    )
};