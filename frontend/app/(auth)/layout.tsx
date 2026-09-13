export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-b from-[#FFE9D4] to-white px-5">
      {children}
    </main>
  );
}
