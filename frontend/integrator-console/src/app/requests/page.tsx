import RequestForm from '../../components/RequestForm';

export default function Page() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-8'>
      {/* @ts-expect-error Server Component */}
      <RequestForm />
    </main>
  );
}
