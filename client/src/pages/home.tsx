import { ScreenshotValidator } from "@/components/screenshot-validator";

export default function Home() {
  return (
    <div className="bg-gray-100 font-sans antialiased text-gray-800 min-h-screen flex items-center justify-center p-4">
      <ScreenshotValidator />
    </div>
  );
}
