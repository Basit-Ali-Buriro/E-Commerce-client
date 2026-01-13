import { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Submitted email:', email);
  };

  return (
    <div className="w-full bg-slate-900 px-4 py-16 text-center text-white flex flex-col items-center justify-center">
      {/* Header */}
      <p className="text-indigo-500 font-medium text-lg">Get Exclusive Offers On Your Email</p>
      <h1 className="max-w-lg font-semibold text-3xl sm:text-4xl mt-4 mb-8">
        Subscribe to our newsletter and stay updated.
      </h1>

      {/* Email Input */}
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
      >
        <div className="w-full sm:flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-full px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your email id"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full px-8 py-3 transition-colors duration-300 whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterSection;