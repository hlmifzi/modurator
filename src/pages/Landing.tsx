import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { Zap, Shield, Code, Layers, Download, Rocket, CheckCircle } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import Seo from "@/components/Seo";

export default function Landing() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // SEO handled by <Seo /> component

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Modurator - Free Form Builder & Module Generator"
        description="Free form builder with drag & drop. Generate CRUD modules in minutes."
        keywords={["free form builder","drag and drop form builder","crud generator","react form builder"]}
        ogTitle="Modurator - Free Form Builder & Module Generator"
        ogDescription="Create beautiful forms and generate full CRUD modules instantly."
      />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Logo className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Modurator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={() => navigate("/builder")} size="lg" className="px-3 md:px-4">
              <Rocket className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Get Started Free</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-block animate-fade-in">
            <span className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              ✨ No coding required
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Free Form Builder
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Build Forms & Modules in Minutes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Create professional forms with drag & drop. Generate complete CRUD modules with list, form, and detail pages. No database setup needed!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/builder")}>
              <Rocket className="mr-2 h-5 w-5" />
              Create Your Form - It's Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => document.getElementById('how-to')?.scrollIntoView({ behavior: 'smooth' })}>
              Watch How It Works
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>No database required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Unlimited forms</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is Modurator */}
      <section className="border-y bg-muted/30 py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">What is Modurator?</h2>
            <p className="text-xl text-muted-foreground">
              Modurator is a powerful form builder and module generator that helps developers and non-developers 
              create professional forms and complete CRUD applications without writing code or setting up databases.
            </p>
            <p className="text-lg text-muted-foreground">
              Simply drag and drop fields, configure your form, and instantly generate a fully functional module 
              with list view, create/edit forms, and detail pages. Everything works with localStorage - no backend required!
            </p>
          </div>
        </div>
      </section>

      {/* Why Use Modurator */}
      <section className="container py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Why Use Modurator?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Save hours of development time with our intuitive form builder
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover-scale">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build complete CRUD modules in minutes. Drag, drop, configure, and deploy instantly.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>No Setup Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Works with localStorage out of the box. No database configuration, no backend setup needed.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader>
              <Code className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Clean Code</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate production-ready React components with TypeScript, Zod validation, and best practices.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader>
              <Layers className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Full CRUD Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get complete list, create, read, update, and delete functionality with search and pagination.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader>
              <Download className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Export & Deploy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Download setup scripts or deploy directly. Integrate seamlessly into your existing projects.
              </p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader>
              <Rocket className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Always Free</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create unlimited forms and modules. No hidden fees, no premium tiers, completely free forever.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Use */}
      <section id="how-to" className="border-y bg-muted/30 py-24">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">How to Use Modurator?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover-scale">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Design Your Form</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Drag and drop fields like text, email, select, radio, and more. Customize labels, validation, and layout.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover-scale">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Preview & Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See your form, list view, and detail pages in real-time. Test functionality before deployment.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover-scale">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Build & Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click "Build & Deploy" to create your module instantly, or download the setup script for manual integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Is Modurator really free?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Modurator is completely free with no hidden costs. Create unlimited forms and modules without any restrictions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Do I need to set up a database?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No! Modurator uses localStorage by default, so your modules work immediately without any backend setup. You can integrate with your own database later if needed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                What technologies does Modurator use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Modurator generates clean React components with TypeScript, Zod for validation, shadcn/ui components, and React Hook Form for form management.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                Can I customize the generated code?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! The generated code is clean, well-structured, and easy to modify. You have full control to customize it for your needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                What field types are supported?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We support text, email, number, textarea, select, checkbox, switch, radio groups, date pickers, and more. Each field is fully customizable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                How do I integrate a module into my project?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Use "Build & Deploy" for instant deployment, or download the setup script which provides step-by-step instructions for manual integration into your React project.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Build Your First Form?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join developers who are shipping faster with Modurator
            </p>
            <Button size="lg" className="text-lg px-12 py-6" onClick={() => navigate("/builder")}>
              <Rocket className="mr-2 h-5 w-5" />
              Try Build Form - It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Logo className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">Modurator</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build forms and modules in minutes. Free forever.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/builder" className="hover:text-primary transition-colors">
                    Form Builder
                  </a>
                </li>
                <li>
                  <a href="#how-to" className="hover:text-primary transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Examples
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Modurator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
