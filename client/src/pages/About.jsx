import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Camera,
  MapPin,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <div className="flex items-center space-x-4">
      <div className="bg-blue-100 p-3 rounded-lg">
        <Icon className="text-blue-600" size={24} />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  </motion.div>
);

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            About iReporter
          </h1>
          <p className="text-xl mb-8">
            Empowering citizens to report corruption and advocate for change.
          </p>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Problem Statement</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Corruption is a huge bane to Africa’s development. African countries must develop novel and localized solutions that will curb this menace, hence the birth of iReporter. iReporter enables any citizen to bring any form of corruption to the notice of appropriate authorities and the general public.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powerful Features for Impact
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to report and track corruption cases.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Camera}
              title="Evidence Upload"
              description="Securely upload photos and videos as evidence."
            />
            <FeatureCard
              icon={MapPin}
              title="Geo-Location"
              description="Precisely mark incident locations on interactive maps."
            />
            <FeatureCard
              icon={Shield}
              title="Anonymous Reporting"
              description="Optional anonymous reporting to protect your identity."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Real-time Updates"
              description="Get notifications on case progress and updates."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Track Progress"
              description="Monitor the status and impact of your reports."
            />
            <FeatureCard
              icon={Users}
              title="Community Support"
              description="Connect with others fighting corruption."
            />
          </div>
        </div>
      </section>

      {/* User Guidelines Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">User Guidelines</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Users can only change geolocation or edit/delete records if the status is not yet marked as "under investigation," "rejected," or "resolved." Only the user who created a record can delete it.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 mb-1 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are already making their voices heard. Together, we can build a more transparent and accountable society.
          </p>
          <NavLink to="/signup">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 inline-flex items-center">
              Get Started Now
              <ArrowRight className="ml-2" size={20} />
            </button>
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
