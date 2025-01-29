// app/plan/majors/page.js
"use client";
import Link from "next/link";

export default function MajorsListingPage() {
  // For now, just hardcode. Eventually, you might fetch a list from your DB or a config file.
  const majors = [
    { slug: "cosc", name: "Computer Science Major" },
    // { slug: "neuro", name: "Neuroscience Major" },
    // { slug: "digital-arts", name: "Digital Arts Minor" },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Available Majors & Minors</h1>
        <ul className="space-y-2">
          {majors.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/plan/majors/${m.slug}`}
                className="text-brandGreen font-semibold hover:underline"
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
