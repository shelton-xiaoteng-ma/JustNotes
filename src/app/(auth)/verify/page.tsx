export default function VerifyPage() {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-4xl font-bold">VerifyPage</h1>
      <p>
        Your email has been verified. Please{" "}
        <a href="/sign-in" className="text-blue-500">
          sign in.
        </a>
      </p>
    </div>
  );
}
