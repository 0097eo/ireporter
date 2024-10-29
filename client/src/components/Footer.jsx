import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import PropTypes from 'prop-types';

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
    aria-label={label}
  >
    <Icon size={24} />
  </a>
);

SocialLink.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-600 text-gray-400">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About iReporter</h3>
            <p className="text-sm">
              iReporter enables citizens to bring any form of corruption to the notice
              of appropriate authorities and the general public.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-blue-500 transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-500 transition-colors duration-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-500 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-500 transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <SocialLink 
                href="https://facebook.com/ireporter"
                icon={Facebook}
                label="Visit our Facebook page"
              />
              <SocialLink 
                href="https://twitter.com/ireporter"
                icon={Twitter}
                label="Follow us on Twitter"
              />
              <SocialLink 
                href="https://instagram.com/ireporter"
                icon={Instagram}
                label="Follow us on Instagram"
              />
              <SocialLink 
                href="https://youtube.com/ireporter"
                icon={Youtube}
                label="Subscribe to our YouTube channel"
              />
              <SocialLink 
                href="mailto:contact@ireporter.com"
                icon={Mail}
                label="Send us an email"
              />
            </div>
            <p className="text-sm">
              Email: contact@ireporter.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p>© {currentYear} iReporter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;