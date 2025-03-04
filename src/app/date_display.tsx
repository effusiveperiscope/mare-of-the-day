"use client"

import { writeOutDate } from "./text"

export default function DateDisplay() {
    return (
        <p>{writeOutDate(new Date())}</p>
    )
}