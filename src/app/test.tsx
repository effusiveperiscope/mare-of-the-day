'use client';

import { useState } from "react";
import { rawSelectionsFromClient } from "./mares";

export default function TestComponent() {
    const [timezoneOffset, setTimezoneOffset] = useState(0);

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="timezoneOffset">Timezone Offset (in hours):</label>
            <input type="number" id="timezoneOffset" name="timezoneOffset" step="0.5"
                onChange={(e)=>setTimezoneOffset(parseFloat(e.target.value))}></input>
            <button 
                type="button"
                onClick={() => rawSelectionsFromClient(new Date(), timezoneOffset * 60 * 60 * 1000)}
            >
                Test
            </button>
        </form>
    )
}