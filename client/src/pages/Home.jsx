import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Camera,
  MapPin,
  MessageSquare
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

const StatisticCard = ({ value, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-lg text-center"
  >
    <h3 className="text-3xl font-bold text-blue-600">{value}</h3>
    <p className="text-gray-600 mt-2">{label}</p>
  </motion.div>
);

StatisticCard.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Report Corruption. Make a Difference.
              </h1>
              <p className="text-xl mb-8">
                Join thousands of citizens in the fight against corruption. 
                Your voice matters in building a transparent society.
              </p>
              <div className="flex space-x-4">
                <NavLink to="/signup">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
                  Get Started
                </button>
                </NavLink>
                <NavLink to="/about">
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
                  Learn More
                </button>
                </NavLink>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://plus.unsplash.com/premium_photo-1682310093719-443b6fe140e8?q=80&w=1824&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Hero illustration"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powerful Features for Impact
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to report and track corruption cases
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Camera}
              title="Evidence Upload"
              description="Securely upload photos and videos as evidence"
            />
            <FeatureCard
              icon={MapPin}
              title="Geo-Location"
              description="Precisely mark incident locations on interactive maps"
            />
            <FeatureCard
              icon={Shield}
              title="Anonymous Reporting"
              description="Optional anonymous reporting to protect your identity"
            />
            <FeatureCard
              icon={MessageSquare}
              title="Real-time Updates"
              description="Get notifications on case progress and updates"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Track Progress"
              description="Monitor the status and impact of your reports"
            />
            <FeatureCard
              icon={Users}
              title="Community Support"
              description="Connect with others fighting corruption"
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">Together, we're making a difference</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatisticCard value="10,000+" label="Reports Filed" />
            <StatisticCard value="82%" label="Resolution Rate" />
            <StatisticCard value="5,000+" label="Active Users" />
            <StatisticCard value="150+" label="Cases Won" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to make your voice heard
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Report',
                description: 'Document the incident in detail'
              },
              {
                step: '02',
                title: 'Add Location',
                description: 'Add details about the location where the incident occurred'
              },
              {
                step: '03',
                title: 'Track Progress',
                description: 'Monitor the investigation and receive updates'
              }
            ].map((item) => (
              <motion.div
                key={item.step}
                whileHover={{ y: -5 }}
                className="text-center p-6"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 mb-1 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are already making their voices heard. 
            Together, we can build a more transparent and accountable society.
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

export default HomePage;



