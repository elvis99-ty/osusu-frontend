import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homePageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>SusuFlow: Empowering Your Financial Future Together</h1>
          <p>Join a community where saving is simple, secure, and rewarding. Experience the modern way to manage contribution circles.</p>
          <Link to="/register" className={styles.ctaButton}>Get Started Today</Link>
        </div>
      </section>

      {/* /About Us Section */}
      <section className={`${styles.section} ${styles.aboutSection}`}>
        <h2>What is SusuFlow?</h2>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <p>Susu, also known as "merry-go-round" or "Ajo" in various cultures, is a time-tested method of collective saving. A group of trusted individuals contribute regularly to a common fund, and each member takes turns receiving the lump sum payout.</p>
            <p>SusuFlow modernizes this traditional system, bringing it online with enhanced security, transparency, and ease of use. It's designed to foster financial discipline, provide access to capital, and build community trust, all from the convenience of your device.</p>
          </div>
          <div className={styles.aboutImage}>
            <img 
                src="https://placehold.co/600x400/6a82fb/FFFFFF?text=Community+Collaboration" 
                alt="People gathering for community saving" 
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/6a82fb/FFFFFF?text=Image+Missing" }}
            />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.howItWorksSection}`}>
        <h2>How It Works</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <i className={`fas fa-user-plus ${styles.icon}`}></i>
            <h3>1. Register & Verify</h3>
            <p>Sign up in minutes and securely verify your account details. Your financial information is protected.</p>
          </div>
          <div className={styles.stepCard}>
            <i className={`fas fa-users ${styles.icon}`}></i>
            <h3>2. Create or Join a Circle</h3>
            <p>Form a new contribution group with friends, family, or colleagues, or browse open circles to join one that fits your goals.</p>
          </div>
          <div className={styles.stepCard}>
            <i className={`fas fa-hand-holding-usd ${styles.icon}`}></i>
            <h3>3. Contribute & Collect</h3>
            <p>Make regular, scheduled contributions. When it's your turn, receive the full accumulated payout directly to your bank account.</p>
          </div>
          <div className={styles.stepCard}>
            <i className={`fas fa-chart-line ${styles.icon}`}></i>
            <h3>4. Track & Grow</h3>
            <p>Monitor your progress, view payment history, and see your financial contributions and payouts in real-time on your dashboard.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.benefitsSection}`}>
        <h2>Benefits of SusuFlow</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <i className={`fas fa-lock ${styles.icon}`}></i>
            <div>
              <h3>Enhanced Security</h3>
              <p>Your contributions are protected with robust encryption and secure payment gateways (Flutterwave integration).</p>
            </div>
          </div>
          <div className={styles.benefitCard}>
            <i className={`fas fa-piggy-bank ${styles.icon}`}></i>
            <div>
              <h3>Structured Savings</h3>
              <p>The disciplined cycle helps you save consistently towards personal goals without temptation.</p>
            </div>
          </div>
          <div className={styles.benefitCard}>
            <i className={`fas fa-handshake ${styles.icon}`}></i>
            <div>
              <h3>Community & Trust</h3>
              <p>Strengthen financial bonds within your trusted circles. SusuFlow promotes transparency among members.</p>
            </div>
          </div>
          <div className={styles.benefitCard}>
            <i className={`fas fa-chart-pie ${styles.icon}`}></i>
            <div>
              <h3>Access to Capital</h3>
              <p>Receive a lump sum payout when it's your turn, providing immediate access to funds for larger needs.</p>
            </div>
          </div>
          <div className={styles.benefitCard}>
            <i className={`fas fa-mobile-alt ${styles.icon}`}></i>
            <div>
              <h3>Convenience</h3>
              <p>Manage contributions, track progress, and communicate with your group members anytime, anywhere.</p>
            </div>
          </div>
          <div className={styles.benefitCard}>
            <i className={`fas fa-shield-alt ${styles.icon}`}></i>
            <div>
              <h3>Transparency</h3>
              <p>All transactions and schedules are clearly visible to group members, fostering complete trust.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.testimonialsSection}`}>
        <h2>What Our Users Say</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <i className={`fas fa-quote-left ${styles.quoteIcon}`}></i>
            <div className={styles.testimonialAvatarContainer}>
                <img
                    src="https://thumbs.dreamstime.com/b/young-african-woman-selling-tomatoes-local-market-counting-money-167358378.jpg" 
                    alt="Aisha P. Avatar"
                    className={styles.testimonialAvatar}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/A1C4FD/FFFFFF?text=Aisha" }} // Fallback
                />
            </div>
            <p className={styles.testimonialText}>"SusuFlow transformed how my family saves! It's so much easier to manage our contribution circle, and the payouts are always on time. Highly recommend!"</p>
            <p className={styles.author}>- Aisha P.</p>
            <p className={styles.authorRole}>Small Business Owner</p>
          </div>
          <div className={styles.testimonialCard}>
            <i className={`fas fa-quote-left ${styles.quoteIcon}`}></i>
            <div className={styles.testimonialAvatarContainer}>
                <img
                    src="data:image/jpeg;base64,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" 
                    alt="David O. Avatar"
                    className={styles.testimonialAvatar}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/C2E9FB/333333?text=David" }} // Fallback
                />
            </div>
            <p className={styles.testimonialText}>"I was skeptical about an online Susu, but SusuFlow proved me wrong. The security features are top-notch, and the interface is incredibly user-friendly. A game-changer for collective savings."</p>
            <p className={styles.author}>- David O.</p>
            <p className={styles.authorRole}>Software Engineer</p>
          </div>
          <div className={styles.testimonialCard}>
            <i className={`fas fa-quote-left ${styles.quoteIcon}`}></i>
            <div className={styles.testimonialAvatarContainer}>
                <img
                    src="data:image/jpeg;base64,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"
                    alt="Blessing N. Avatar"
                    className={styles.testimonialAvatar}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/50E3C2/333333?text=Blessing" }} // Fallback
                />
            </div>
            <p className={styles.testimonialText}>"Thanks to SusuFlow, I finally saved enough for a down payment on my apartment. The discipline of the circle combined with the app's transparency made it possible. Truly amazing!"</p>
            <p className={styles.author}>- Blessing N.</p>
            <p className={styles.authorRole}>Graphic Designer</p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.callToActionSection}`}>
        <h2>Ready to Start Your Susu Journey?</h2>
        <p className={styles.heroSection}>Join thousands of users building their financial strength. It's free to sign up and easy to get started.</p>
        <Link to="/register" className={styles.ctaButton}>Create Your Free Account</Link>
      </section>
    </div>
  );
};

export default Home;