import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface AbrName {
  Abn?: string;
  AbnStatus?: string;
  Name?: string;
  State?: string;
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name || name.trim().length < 3) {
    return NextResponse.json({ results: [] });
  }

  const guid = process.env.ABN_LOOKUP_GUID;
  if (!guid) {
    return NextResponse.json({ results: [], error: "ABN_LOOKUP_GUID not configured" });
  }

  try {
    const url = `https://abr.business.gov.au/json/MatchingNames.aspx?name=${encodeURIComponent(name.trim())}&guid=${guid}`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`ABR responded ${res.status}`);

    const json = await res.json();

    if (json.Message) {
      return NextResponse.json({ results: [], error: json.Message });
    }

    const results = ((json.Names ?? []) as AbrName[]).slice(0, 5).map((n) => ({
      abn: n.Abn ?? "",
      name: n.Name ?? "",
      state: n.State ?? "",
      status: n.AbnStatus ?? "",
    })).filter((r) => r.abn);

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ results: [], error: String(err) });
  }
}
