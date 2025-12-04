/* eslint-disable react/no-unescaped-entities */
'use client';

import { useSelector } from 'store/store';
import styles from './termService.module.css';

export default function PrivacyPolicy() {
  const {
    info: { isSmallScreen, theme },
  } = useSelector((store) => store);

  return (
    <div
      className={`${isSmallScreen ? 'px-[20px]' : 'max-w-[780Px]'} mx-auto pb-[40Px] ${styles['term-service']} ${
        theme === 'dark' && styles['term-service-dark']
      }`}>
      <article className="pt-[20Px]">
        <hgroup>
          <h1 className="text-center mb-0">Privacy Policy</h1>
          <p className="text-center mb-[2em]">Last Updated: September 8, 2023</p>
        </hgroup>
        <p>
          eforest.finance or any other products released by Forest ("Forest Ecosystem,""Forest," "Forest Service,"we,"
          "us,"or "our"), facilitates interaction with certain decentralized cryptographic protocols to support the
          creation, sale and distribution of non-fungible tokens (“NFTs”) on decentralized blockchains (“Blockchain”).
          This Privacy Policy is designed to help you understand how we collect, use, process, and share your personal
          information, and to help you understand and exercise your privacy rights. This Privacy Policy also constitutes
          a part of Forest Terms of Services (the “Terms”). The terms used in this Privacy Policy shall have the same
          meanings as in the Terms except as otherwise provided herein.
        </p>
        <br />
        <h2>1. SCOPE AND UPDATES TO THIS PRIVACY POLICY </h2>
        <p>
          This Privacy Policy applies to personal information processed by us, including on our websites (“Site”), and
          other online or offline offerings. To make this Privacy Policy easier to read, the Site and our services are
          collectively called the “Forest Services” or “Services”.
        </p>
        <br />
        <p>
          <strong>An Important Note:</strong> This Privacy Policy does not apply to any of the personal information that
          is processed by third-party providers, including those that support, protocolize, or otherwise interact with
          the Blockchain. Our services allow you to connect and interact with a public and decentralized Blockchain,
          which means information about your digital wallet address (“Digital Wallet”), balances, and transactions are
          publicly broadcast by the protocol to the Blockchain. Any questions or requests relating to your information,
          whether personal or otherwise, that you enter onto the Blockchain should be directed to the relevant parties
          that process this information.
        </p>
        <p>
          <br />
          <strong>Changes to our Privacy Policy.</strong> We may revise this Privacy Policy from time to time in our
          sole discretion. If there are any material changes to this Privacy Policy, we will notify you as required by
          applicable law. You understand and agree that you will be deemed to have accepted the updated Privacy Policy
          if you continue to use our Services after the new Privacy Policy takes effect.
        </p>
        <br />
        <h2>2. PERSONAL INFORMATION WE COLLECT </h2>
        <p>
          The categories of personal information we collect depend on how you interact with us, our Services, and the
          requirements of applicable law. We collect information that you provide to us, information we obtain
          automatically when you use our Services, and information from other sources such as third-party services and
          organizations, as described below.
        </p>
        <p>A. Personal Information YOU PROVIDE TO US DIRECTLY</p>
        <p>We may collect personal information that you provide to us.</p>
        <ul>
          <li>
            <strong>Wallet Connection.</strong> We may collect personal information when you connect your Digital
            Wallet, such as your wallet address, your wallet balance, your past or future transactions, and your
            interactions with the Blockchain.{' '}
          </li>
          <li>
            <strong>Transactions.</strong> We may collect personal information and details associated with purchases you
            make using our Services, including information about what you purchased, from whom, the amount you paid, the
            cryptocurrency you used, and other information about the transaction.
          </li>
          <li>
            <strong>Your Communications with Us.</strong> We may collect personal information, such as your email
            address, phone number, or mailing address, if we ask for it, and only when you provide this information to
            us, in the course of any request you make to us about our Services, register for our subscriptions, loyalty
            programs, participate in request customer or technical support, or otherwise communicate with us.
          </li>
          <li>
            <strong>Surveys.</strong> We may contact you to participate in surveys. If you decide to participate, we may
            collect personal information from you in connection with the survey.
          </li>
          <li>
            <strong>Interactive Features.</strong> We and others who use our Services may collect personal information
            that you submit or make available through our interactive features (e.g., messaging and chat features,
            commenting functionalities, forums, blogs, and social media pages). Any information you provide using the
            public sharing features of the Services will be considered “public,” unless otherwise required by applicable
            law, and is not subject to the privacy protections referenced herein.
          </li>
          <li>
            <strong>Sweepstakes or Contests.</strong> We may collect personal information you provide for any
            sweepstakes or contests that we offer. In some jurisdictions, we are required to publicly share information
            of sweepstakes and contest winners.
          </li>
          <li>
            <strong>Conferences, Trade Shows, and Other Events.</strong> We may collect personal information from
            individuals when we attend or host conferences, trade shows, and other events.
          </li>
          <li>
            <strong> Business Development and Strategic Partnerships. </strong> We may collect personal information from
            individuals and third parties to assess and pursue potential business opportunities.
          </li>
        </ul>
        <h2>3.Personal Information Collected Automatically</h2>
        <p>We may collect personal information automatically when you use our Services. </p>
        <ul>
          <li>
            <strong>Automatic Collection of Personal Information.</strong> We may collect certain information
            automatically when you use our Services, such as your Internet protocol (IP) address, user settings, MAC
            address, cookie identifiers, mobile carrier, mobile advertising and other unique identifiers, browser or
            device information, location information (including approximate location derived from IP address), and
            Internet service provider. We may also automatically collect information regarding your use of our Services,
            such as pages that you visit before, during and after using our Services, information about the links you
            click, the types of content you interact with, the frequency and duration of your activities, and other
            information about how you use our Services.
          </li>
          <li>
            <strong>Cookie Policy (and Other Technologies). </strong>We, as well as third parties that provide content,
            advertising, or other functionality on our Services, may use cookies, pixel tags, and other technologies
            (“Technologies”) to automatically collect information through your use of our Services.
            <ul>
              <li>
                1. Cookies. Cookies are small text files placed in device browsers that store preferences and facilitate
                and enhance your experience.
              </li>
              <li>
                2. Pixel Tags/Web Beacons. A pixel tag (also known as a web beacon) is a piece of code embedded in our
                Services that collects information about engagement on our Services. The use of a pixel tag allows us to
                record, for example, that a user has visited a particular web page or clicked on a particular
                advertisement. We may also include web beacons in e-mails to understand whether messages have been
                opened, acted on, or forwarded.
              </li>
            </ul>
          </li>
          <li>
            <strong>Operationally Necessary.</strong> This includes Technologies that allow you access to our Services,
            applications, and tools that are required to identify irregular website behavior, prevent fraudulent
            activity, improve security, or allow you to make use of our functionality;
          </li>
          <li>
            <strong>Performance-Related.</strong> We may use Technologies to assess the performance of our Services,
            including as part of our analytic practices to help us understand how individuals use our Services (see
            Analytics below);
          </li>
          <li>
            <strong>Functionality-Related.</strong> We may use Technologies that allow us to offer you enhanced
            functionality when accessing or using our Services. This may include identifying you when you sign into our
            Services or keeping track of your specified preferences, interests, or past items viewed;
          </li>
          <p>
            See <strong className="underline underline-offset-4">“Your Privacy Choices and Rights”</strong> below to
            understand your choices regarding these Technologies.
          </p>
          <li>
            <strong>Analytics. </strong>We may use Technologies and other third-party tools to process analytics
            information on our Services. These Technologies allow us to better understand how our digital Services are
            used and to continually improve and personalize our Services. To the extent these are used, include: Some of
            our analytics partners include:
            <ul>
              <li>
                {' '}
                <strong>1. Google Analytics.</strong> For more information about how Google uses your personal
                information (including for its own purposes, e.g., for profiling or linking it to other data), please
                visit Google Analytics’ Privacy Policy. To learn more about how to opt-out of Google Analytics’ use of
                your information, please click{' '}
                <a href="https://support.google.com/analytics/answer/12017362?hl=en&sjid=14343844447056978337-AP">
                  here
                </a>
                .
              </li>
              <li>
                <strong>2. Sentry. We use Sentry analytics services. </strong>This allows us to capture the crashes
                generated by users during use for reporting and processing, and assist in the development and
                improvement of products. For more information about how sentry uses your personal information, please
                visit Sentry’s Privacy Policy. To learn more about how to opt out of Sentry’s use of your information,
                please click <a href="https://sentry.io/privacy/">here</a>.
              </li>
              <li>
                <strong>Social Media Platforms.</strong> Our Services may contain social media buttons, such as Discord,
                which might include widgets such as the “share this” button or other interactive mini programs). These
                features may collect personal information such as your IP address and which page you are visiting on our
                Services, and may set a cookie to enable the feature to function properly. Your interactions with these
                platforms are governed by the privacy policy of the company providing it.
              </li>
            </ul>
          </li>
        </ul>
        <h2>C.Personal Information Collected from Other Sources</h2>
        <p>
          Third-Party Services and Sources. We may obtain personal information about you from other sources, including
          through third-party services and organizations, such as the public Blockchain. For example, if you access our
          Services through a third-party application, or use our Services to access a third-party service, protocol, an
          app store, a third-party login service, or a social networking site, we may collect personal information about
          you from that third-party application that you have made available via your privacy settings.
        </p>
        <h2>3. HOW WE USE YOUR PERSONAL INFORMATION</h2>
        <p>
          We use your personal information for a variety of business purposes, including to provide our Services, for
          administrative purposes, and to market our products and Services, as described below.
        </p>
        <h3>A. Provide Our Services</h3>
        <p>We use your information to fulfill our contract with you and provide you with our Services, such as: </p>
        <ul>
          <li>Managing your experience on our Services;</li>
          <li>Providing access to certain areas, functionalities, and features of our Services;</li>
          <li>
            Understanding your interaction with our Services through publicly available Blockchain information you
            share;
          </li>
          <li>Answering requests for customer or technical support;</li>
          <li>Communicating with you about your account, activities on our Services, and policy changes;</li>
          <li>Processing applications if you apply for a job we post on our Services; and</li>
          <li> Allowing you to register for events or promotions. </li>
        </ul>
        <h3> B. Administrative Purposes </h3>
        <p>We use your information for various administrative purposes, such as: </p>
        <ul>
          <li>
            Pursuing our legitimate interests such as direct marketing, research and development (including marketing
            research), network and information security, and fraud prevention;
          </li>
          <li>
            Detecting security incidents, protecting against malicious, deceptive, fraudulent or illegal activity, and
            prosecuting those responsible for that activity;
          </li>
          <li>Measuring interest and engagement in our Services;</li>
          <li>Short-term, transient use, such as contextual customization of ads;</li>
          <li>Improving, upgrading, or enhancing our Services; </li>
          <li>Developing new products and services;</li>
          <li>Ensuring internal quality control and safety;</li>
          <li>
            Authenticating and verifying individual identities, including requests to exercise your rights under this
            Privacy Policy;
          </li>
          <li>Debugging to identify and repair errors with our Services;</li>
          <li>Auditing relating to interactions, transactions, and other compliance activities;</li>
          <li>Sharing personal information with third parties as needed to provide the Services;</li>
          <li>Enforcing our agreements and policies; and</li>
          <li>Carrying out activities that are required to comply with our legal obligations.</li>
        </ul>
        <h2>C. Marketing and Advertising our Products and Services</h2>
        <p>
          We may use personal information to tailor and provide you with content and advertisements. We may provide you
          with these materials as permitted by applicable law.{' '}
        </p>
        <p>
          If you have any questions about our marketing practices, you may contact us at any time as set forth in
          “Contact Us” below.{' '}
        </p>
        <h2> D. With Your Consent </h2>
        <p>
          We may use personal information for other purposes that are clearly disclosed to you at the time you provide
          personal information or with your consent.{' '}
        </p>
        <h2>E. Other Purposes</h2>
        <p>
          We also use your personal information for other purposes as requested by you or as permitted by applicable
          law.
        </p>
        <ul>
          <li>
            <strong>Automated Decision Making.</strong> We may engage in automated decision making, including profiling.
            For example, we may engage in automated decision making to detect fraud. Forest Economy’s processing of your
            personal information will not result in a decision based solely on automated processing that significantly
            affects you unless such a decision is necessary as part of a contract we have with you, we have your
            consent, or we are permitted by law to engage in such automated decision making. If you have questions about
            our automated decision making, you may contact us as set forth in “Contact Us” below.
          </li>
          <li>
            <strong>De-identified and Aggregated Information.</strong> We may use personal information to create
            deidentified and/or aggregated information, such as demographic information, information about the device
            from which you access our Services, or other analyses we create.
          </li>
        </ul>
        <h2>4. HOW WE DISCLOSE YOUR PERSONAL INFORMATION </h2>
        <p>
          We disclose your personal information to third parties for a variety of business purposes, including to
          provide our Services, to protect us or others, or in the event of a major business transaction such as a
          merger, sale, or asset transfer, as described below.{' '}
        </p>
        <h3> A. Disclosures to Provide our Services </h3>
        <p>The categories of third parties with whom we may share your personal information are described below. </p>
        <ul>
          <li>
            <strong>Service Providers.</strong> We may share your personal information with our third-party service
            providers and vendors that assist us with the provision of our Services. This includes service providers and
            vendors that provide us with IT support, hosting, payment processing, customer service, and related
            services.
          </li>
          <li>
            <strong>Affiliates.</strong> We may share your personal information with our company affiliates for example:
            for our administrative purposes, IT management, or for them to provide services to you or support and
            supplement the Services we provide.
          </li>
          <li>
            <strong>Other Users or Third Parties You Share or Interact With.</strong> As described above in “Personal
            Information We Collect,” because our Services use information about you that you share to a public
            Blockchain, your use of our Services may be published to that public Blockchain, which is accessible to
            others, including those who may not use our Services. In addition, and in connection with a promotion or
            airdrop, we may allow you to share personal information or interact with others, and third parties
            (including individuals and third parties who do not use our Services and the general public).
          </li>
          <li>
            <strong>Advertising Partners.</strong> We may share your personal information with third-party advertising
            partners. These third-party advertising partners may set Technologies and other tracking tools on our
            Services to collect information regarding your activities and your device (e.g., your IP address, cookie
            identifiers, page(s) visited, location, time of day). These advertising partners may use this information
            (and similar information collected from other services) for purposes of delivering personalized
            advertisements to you when you visit digital properties within their networks. This practice is commonly
            referred to as “interest-based advertising” or “personalized advertising.”
          </li>
          <li>
            APIs/SDKs. We may use third-party application program interfaces (“APIs”) and software development kits
            (“SDKs”) as part of the functionality of our Services. For more information about our use of APIs and SDKs,
            please contact us as set forth in “Contact Us” below.
          </li>
        </ul>
        <h2> B. Disclosures to Protect Us or Others </h2>
        <p>
          We may access, preserve, and disclose any information we store associated with you to external parties if we,
          in good faith, believe doing so is required or appropriate to: comply with law enforcement or national
          security requests and legal process, such as a court order or subpoena; protect your, our, or others’ rights,
          property, or safety; enforce our policies or contracts; collect amounts owed to us; or assist with an
          investigation or prosecution of suspected or actual illegal activity.{' '}
        </p>
        <h2> C. Disclosure in the Event of Merger, Sale, or Other Asset Transfers </h2>
        <p>
          If we are involved in a merger, acquisition, financing due diligence, reorganization, bankruptcy,
          receivership, purchase or sale of assets, or transition of service to another provider, your information may
          be sold or transferred as part of such a transaction, as permitted by law and/or contract.
        </p>
        <h2>5. YOUR PRIVACY CHOICES AND RIGHTS</h2>
        <p>
          <strong>Your Privacy Choices.</strong> The privacy choices you may have about your personal information are
          determined by applicable law and are described below.
        </p>
        <ul>
          <li>
            {' '}
            Email Communications. If you receive an unwanted email from us, you can use the unsubscribe link found at
            the bottom of the email to opt out of receiving future emails. Note that you will continue to receive
            transaction-related emails regarding products or Services you have requested. We may also send you certain
            non-promotional communications regarding us and our Services, and you will not be able to opt out of those
            communications (e.g., communications regarding our Services or updates to our Terms or this Privacy Policy).{' '}
          </li>
          <li>
            Mobile Devices. We may send you push notifications through our mobile application. You may opt out from
            receiving these push notifications by changing the settings on your mobile device. With your consent, we may
            also collect precise location-based information via our mobile application. You may opt out of this
            collection by changing the settings on your mobile device. • “Do Not Track.” Do Not Track (“DNT”) is a
            privacy preference that users can set in certain web browsers. Please note that we do not respond to or
            honor DNT signals or similar mechanisms transmitted by web browsers.
          </li>
          <li>
            Cookies and Personalized Advertising. You may stop or restrict the placement of Technologies on your device
            or remove them by adjusting your preferences as your browser or device permits. However, if you adjust your
            preferences, our Services may not work properly. Please note that cookie-based opt-outs are not effective on
            mobile applications. However, you may opt-out of personalized advertisements on some mobile applications by
            following the instructions for Android, iOS, and others.
          </li>
        </ul>
        <p>
          The online advertising industry also provides websites from which you may opt out of receiving targeted ads
          from data partners and other advertising partners that participate in self-regulatory programs. You can access
          these and learn more about targeted advertising and consumer choice and privacy by visiting the Network
          Advertising Initiative, the Digital Advertising Alliance, the European Digital Advertising Alliance, and the
          Digital Advertising Alliance of Canada.
        </p>
      </article>
      <article>
        <h1>Please note you must separately opt out in each browser and on each device.</h1>
        <p>Your Privacy Rights. In accordance with applicable law, you may have the right to: </p>
        <ul>
          <li>
            Access to and Portability of Your Personal Information, including: (i) confirming whether we are processing
            your personal information; (ii) obtaining access to or a copy of your personal information; and (iii)
            receiving an electronic copy of personal information that you have provided to us, or asking us to send that
            information to another company in a structured, commonly used, and machine readable format (also known as
            the “right of data portability”);
          </li>
          <li>
            Request Correction of your personal information where it is inaccurate or incomplete. In some cases, we may
            provide self-service tools that enable you to update your personal information; • Request Deletion of your
            personal information;
          </li>
          <li>
            Request Restriction of or Object to our processing of your personal information where the processing of your
            personal information is based on our legitimate interest or for direct marketing purposes; and
          </li>
          <li>
            Withdraw your Consent to our processing of your personal information. Please note that your withdrawal will
            only take effect for future processing, and will not affect the lawfulness of processing before the
            withdrawal. If you would like to exercise any of these rights, please contact us as set forth in “Contact
            Us” below will process such requests in accordance with applicable laws.
          </li>
        </ul>
        <h2>6. SECURITY OF YOUR INFORMATION</h2>
        <p>
          We take steps to ensure that your information is treated securely and in accordance with this Privacy Policy.
          Unfortunately, no system is 100% secure, and we cannot ensure or warrant the security of any information you
          provide to us. To the fullest extent permitted by applicable law, we do not accept liability for unauthorized
          access, use, disclosure, or loss of personal information.
        </p>
        <p>
          By using our Services or providing personal information to us, you agree that we may communicate with you
          electronically regarding security, privacy, and administrative issues relating to your use of our Services. If
          we learn of a security system’s breach, we may attempt to notify you electronically by posting a notice on our
          Services, by mail, or by sending an email to you.
        </p>
        <h2>7. INTERNATIONAL DATA TRANSFERS</h2>
        <p>
          All information processed by us may be transferred, processed, and stored anywhere in the world, including,
          but not limited to, the United States or other countries, which may have data protection laws that are
          different from the laws where you live. We endeavor to safeguard your information consistent with the
          requirements of applicable laws.
        </p>
        <p>
          If we transfer personal information which originates in some regions where have been protected by Personal
          Data protection Laws and Regulations including, but not limited to Singapore, the United States, Canada, the
          European Economic Area, Switzerland, and/or the United Kingdom, to a country that has not been found to
          provide an adequate level of protection under applicable data protection laws, one of the safeguards we may
          use to support such transfer is the The Personal Data Protection Act (PDPA) released by Personal Data
          Protection Commission Singapore.
        </p>
        <h2>8. RETENTION OF PERSONAL INFORMATION</h2>
        <p>
          We store the personal information we collect as described in this Privacy Policy for as long as you use our
          Services, or as necessary to fulfill the purpose(s) for which it was collected, provide our Services, resolve
          disputes, establish legal defenses, conduct audits, pursue legitimate business purposes, enforce our
          agreements, and comply with applicable laws.
        </p>
        <h2>9. CHILDREN’S INFORMATION</h2>
        <p>
          The Services are not directed to children under 13 in the United States, or those under the age of consent in
          their relevant jurisdiction, including Singapore, Canada, the European Union, and we do not knowingly collect
          personal information from children. If you are a parent or guardian and believe your child has uploaded
          personal information to our site without your consent, you may contact us as described in “Contact Us” below.
          If we become aware that a child has provided us with personal information in violation of applicable law, we
          will delete any personal information we have collected, unless we have a legal obligation to keep it.
        </p>
        <h2>10. OTHER PROVISIONS</h2>
        <p>
          Third-Party Websites/Applications. The Services may contain links to other websites/applications and other
          websites/applications may reference or link to our Services. These third-party services are not controlled by
          us. We encourage our users to read the privacy policies of each website and application with which they
          interact. We do not endorse, screen, or approve, and are not responsible for, the privacy practices or content
          of such other websites or applications. Providing personal information to third-party websites or applications
          is at your own risk. Supervisory Authority. If your personal information is subject to the applicable data
          protection laws of Singapore, Canada, the United States, Australia, Brazil, the European Economic Area,
          Switzerland, or the United Kingdom,, you have the right to lodge a complaint with the competent supervisory
          authority or attorney general if you believe our processing of your personal information violates applicable
          law.
        </p>
        <br />
        <p className="leading-loose">
          <a
            className="leading-loose"
            href="https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act">
            Personal DataProtection Commission Singapore
          </a>
          <br />
          <a
            className="leading-loose"
            href="https://www.state.gov/bureaus-offices/under-secretary-for-management/bureau-of-administration/privacy-office/">
            Privacy Office. U.S.DEPARTMENT of STATE
          </a>
          <br />
          <a
            className="leading-loose"
            href="https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/">
            Office of the Privacy Commissioner of Canada
          </a>
          <br />
          <a className="leading-loose" href="https://www.oaic.gov.au/">
            Office of the Australian Information Commissioner
          </a>
          <br />
          <a href="https://www.gov.br/anpd/pt-br">Autoridade Nacionalde Proteçãode Dados (ANPD) </a>
          <br />
          <a className="leading-loose" href="https://edpb.europa.eu/about-edpb/about-edpb/members_en">
            Autoridade Nacionalde Proteçãode Dados (ANPD)
          </a>
          <br />
          <a className="leading-loose" href="https://www.edoeb.admin.ch/edoeb/en/home/deredoeb/kontakt.html">
            EEA Data Protection Authorities (DPAs){' '}
          </a>
          <br />
          <a className="leading-loose" href="https://www.edoeb.admin.ch/edoeb/en/home/deredoeb/kontakt.html">
            Swiss Federal Data Protection and Information Commissioner (FDPIC)
          </a>
          <br />
          <a className="leading-loose" href="https://ico.org.uk/global/contact-us/">
            UK Information Commissioner’s Office (ICO){' '}
          </a>
        </p>
        <h2>11. CONTACT US </h2>
        <p>
          Forest Economy is the controller of the personal information we process under this Privacy Policy. If you have
          any questions about our privacy practices or this Privacy Policy, or to exercise your rights as detailed in
          this Privacy Policy, please contact us at info@eforest.finance
        </p>
      </article>
    </div>
  );
}
