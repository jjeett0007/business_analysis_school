import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Business Analysis School</h3>
            <p className="text-sm text-muted-foreground">
              Empowering the next generation of business analysts with comprehensive training and career support.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Programs Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Programs</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Business Analysis Fundamentals</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Agile Business Analysis</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Data Analysis & Visualization</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Advanced Certification</li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Student Portal</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Career Services</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Payment Plans</li>
              <li className="hover:text-primary cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span>support@businessanalysisschool.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span>123 Education Ave, Learning City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Business Analysis School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;