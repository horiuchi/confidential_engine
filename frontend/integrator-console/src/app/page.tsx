import BuildForm from '../components/BuildForm';

export default function Home() {
  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-between p-8'>
      {/* @ts-expect-error Server Component */}
      <BuildForm />
    </main>
  );
}
