// Hardcoded mares!
import Image from "next/image";
import { getMare } from "../mares";

export function mareDisplay(mare: string) {
    return (
        <div className="flex flex-col items-center">
            <Image
                src={getMare(mare).image} alt={`Image of ${mare}`}
                className="rounded-full mb-4 h-32 w-32" width="100" height="100" />
            <h2 className="text-2xl mb-4">{mare}</h2>
        </div>
    );
}
