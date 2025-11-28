
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a clean layout that doesn't include the main site's Header or Footer.
  // It only renders the children, which will be the admin-specific layouts and pages.
  return <>{children}</>;
}
