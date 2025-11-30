import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="grow max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
