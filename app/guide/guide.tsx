import React from "react";
import { useTheme } from "~/components/ThemeContext";
import { Link } from "react-router-dom";

/**
 * GuidePage – step‑by‑step walkthrough of the marketplace.
 *
 * – Drop images in `/public/images/guide/…` and update the <img src> paths.
 * – Add or reorder sections by editing the `Table of Contents` nav and matching `id` props.
 */
const guide: React.FC = () => {
  const { theme } = useTheme();
  const sectionStyles =
    theme === "dark"
      ? "border-gray-700 bg-gray-800"
      : "border-gray-300 bg-gray-50";
  const textMuted = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div
      id="top"
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-8 text-center">Website Guide</h1>

        {/* Table of Contents */}
        <nav className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <a href="#getting-started" className="hover:underline">
                Getting Started
              </a>
            </li>
            <li>
              <a href="#creating-account" className="hover:underline">
                Creating an Account
              </a>
            </li>
            <li>
              <a href="#buying-items" className="hover:underline">
                Buying Items
              </a>
            </li>
            <li>
              <a href="#selling-items" className="hover:underline">
                Selling Items
              </a>
            </li>
            <li>
              <a href="#chat" className="hover:underline">
                Chatting With Buyers/Sellers
              </a>
            </li>
            <li>
              <a href="#safety-tips" className="hover:underline">
                Safety Tips
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:underline">
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        {/* Section: Getting Started */}
        <section
          id="getting-started"
          className={`p-6 mb-8 rounded-xl shadow-md border ${sectionStyles}`}
        >
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-lg mb-6">
            Follow these steps to get up and running quickly:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>You can browse all public listings without making an account.</li>
            <li>Simply navigate to the homepage and click on any of the listings that intrigue you.</li>
            <li>To interact with any part of the listing, we require you to make an account.</li>
            <li>You can do that by clicking the side bar on the top right of the screen and clicking sign up.</li>
          </ol>
          <div className="w-full mt-6">
            {/* Replace with an actual screenshot */}
            <img
              src="/images/homepage.png"
              alt="Homepage overview"
              className="w-full rounded-lg"
            />
            <p className={`${textMuted} mt-2 text-sm`}>Figure 1. Homepage overview</p>
          </div>
        </section>

        {/* Section: Creating an Account */}
        <section
          id="creating-account"
          className={`p-6 mb-8 rounded-xl shadow-md border ${sectionStyles}`}
        >
          <h2 className="text-2xl font-semibold mb-4">Creating an Account</h2>
          <p className="text-lg mb-6">
            Full access accounts are restricted to verified Purdue students.
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              Click the <span className="font-medium">Sign Up</span> button in the
              header.
            </li>
            <li>Enter your email and a strong password.</li>
            <li>
              Check your inbox for a verification link and confirm your email to
              activate your account.
            </li>
            <li>Once you have created an account, you need to verify that you are a Purdue University student.</li>
            <li>Verify with your Purdue email to unlock full features; check spam/promotions if you don’t see the link.</li>

          </ol>
          <div className="w-full mt-6">
            <img
              src="/images/verifyemail.png"
              alt="Create account form"
              className="w-full rounded-lg"
            />
            <p className={`${textMuted} mt-2 text-sm`}>Figure 2. Account creation form</p>
          </div>
        </section>

        {/* Section: Buying Items */}
        <section
          id="buying-items"
          className={`p-6 mb-8 rounded-xl shadow-md border ${sectionStyles}`}
        >
          <h2 className="text-2xl font-semibold mb-4">Buying Items</h2>
          <p className="text-lg mb-6">
            Tips for finding what you need quickly and safely.
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>Use the search bar or filters to narrow results.</li>
            <li>Locate any item that you might be interested in and click on the listing to read the details.</li>
            <li>Click into a seller's profile via their icon to check seller ratings and read their reviews.</li>
            <li>
              Click <span className="font-medium">Message Seller</span> to arrange
              a deal and meetup on campus.
            </li>
          </ol>
          <div className="w-full mt-6">
            <img
              src="/images/buying.png"
              alt="Buyer flow"
              className="w-full rounded-lg"
            />
            <p className={`${textMuted} mt-2 text-sm`}>Figure 3. Buyer flow</p>
          </div>
        </section>

        {/* Section: Selling Items */}
        <section
          id="selling-items"
          className={`p-6 mb-8 rounded-xl shadow-md border ${sectionStyles}`}
        >
          <h2 className="text-2xl font-semibold mb-4">Selling Items</h2>
          <p className="text-lg mb-6">
            Post your textbooks, furniture, or tech in minutes.
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>Navigate to <span className="font-medium">View My Profile</span> and click the green "+" circle to create a listing.</li>
            <li>Upload high‑quality images for better sales.</li>
            <li>Fill in the relevant details such as a title, description, category, location, and price, then click "Post Listing".</li>
            <li>
              Mark the item as <span className="italic">Sold</span> once the deal is
              complete to keep listings fresh.
            </li>
          </ol>
          <div className="w-full mt-6">
            <img
              src="/images/selling.png"
              alt="Sell item form"
              className="w-full rounded-lg"
            />
            <p className={`${textMuted} mt-2 text-sm`}>Figure 4. Sell form</p>
          </div>
        </section>

        <section
          id="chat"
          className={`p-6 mb-8 rounded-xl shadow-md border ${sectionStyles}`}
        >
          <h2 className="text-2xl font-semibold mb-4">Chatting With Buyers/Sellers</h2>
          <p className="text-lg mb-6">
            Chat with all of your fellow buyers and negotiate with other sellers.
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>Once you have messaged a seller, you can click on "Inbox" in the navigation bar to see all of your chats.</li>
            <li>From here, you can either message anyone who wants to buy something for you or negotiate with a seller for an item you're trying to purchase.</li>
          </ol>
          <div className="w-full mt-6">
            <img
              src="/images/chat.png"
              alt="Chatroom"
              className="w-full rounded-lg"
            />
            <p className={`${textMuted} mt-2 text-sm`}>Figure 5. Chatroom</p>
          </div>
        </section>

        {/* Section: Safety Tips */}
        <section
          id="safety-tips"
          className={`p-6 mb-8 rounded-xl shadow-md border ${sectionStyles}`}
        >
          <h2 className="text-2xl font-semibold mb-4">Safety Tips</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Meet in well‑lit, public areas like the Purdue Memorial Union, CoRec, Krach Learning Center, etc.</li>
            <li>Bring a friend when exchanging high‑value items.</li>
            <li>Use payment methods such as cash or Zelle to avoid any post-purchase incidents.</li>
            <li>Report suspicious users via the <span className="font-medium">Report</span> button.</li>
          </ul>
        </section>

        {/* Section: FAQ */}
        <section
          id="faq"
          className={`p-6 mb-8 rounded-xl shadow-md border ${sectionStyles}`}
        >
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
          <div>
              <h3 className="font-medium">Is the platform free?</h3>
              <p className={textMuted}>
                Yes—joining and listing items is completely free for Purdue
                students.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Can I buy/sell on this platform if I'm not a student?</h3>
              <p className={textMuted}>
                No.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Can I edit my listing after posting?</h3>
              <p className={textMuted}>
                Navigate to your profile and select the icon with the person and a pencil on the listing you want to
                modify.
              </p>
            </div>
            {/* Add more Q&A pairs as needed */}
          </div>
        </section>

        {/* Back to top link */}
        <div className="text-center">
          <a
            href="#top"
            className="inline-block py-2 px-4 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Back to Top
          </a>
        </div>
      </div>
    </div>
  );
};

export default guide;