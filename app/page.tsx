import QRCode from "qrcode";
import { CardScene } from "@/components/CardScene";
import { getSiteUrl } from "@/lib/site";

export default async function Home() {
  const url = `${getSiteUrl()}/portfolio`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    color: { dark: "#111111", light: "#ffffff" },
  });
  return <CardScene qrDataUrl={qrDataUrl} />;
}
