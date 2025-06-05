
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-6 mt-auto bg-card border-t">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} GetFit. All rights reserved.</p>
        <p>Developed by Prakash Jadhav</p>
      </div>
    </footer>
  );
}
