/* eslint-disable react/no-unescaped-entities */
'use client';

import { useSelector } from 'store/store';
import styles from './termService.module.css';

export default function TermService() {
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
          <h1 className="text-center mb-0">Terms of Service</h1>
          <p className="text-center mb-[2em]">Last Updated: August 28, 2023</p>
        </hgroup>
      </article>
      <p>
        Please read the Terms of Service (the "Terms") carefully as it governs your use of the website and interface
        located at eforest.finance (the “Site”or the“Forest”) , which facilitates interaction with certain decentralized
        cryptographic protocols that we do not own or control (“Protocols”) to support users to create, sell, buy,
        display and interact with digital art published to the AELF blockchain as non-fungible tokens (“NFTs”). To make
        these Terms easier to read, the Site and our services are collectively called the “Forest Services”. BY MAKING
        USE OF FOREST SERVICES, YOU ACKNOWLEDGE AND AGREE THAT: (1) YOU ARE AWARE OF THE RISKS ASSOCIATED WITH
        TRANSACTIONS OF DIGITAL CURRENCIES AND THEIR DERIVATIVES; (2) YOU SHALL ASSUME ALL RISKS RELATED TO THE USE OF
        FOREST SERVICES AND TRANSACTIONS OF SYNTHETIC ASSETS AND THEIR DERIVATIVES; AND (3) FOREST SHALL NOT BE LIABLE
        FOR ANY SUCH RISKS OR ADVERSE OUTCOMES.
      </p>

      <p>
        In addition, since Forest is aiming to build a decentralized and smart contract-powered digital art ecosystem
        (“Forest Ecosystem”) operating on the AELF blockchain. the Terms also explain the terms and conditions by which
        you may access and use the Products and Services provided by Forest Ecosystem (referred to herein as “Forest”,
        “Forest Ecosystem”, "we", "our", or "us"). The Products shall include, but shall not necessarily be limited to,
        (a) eforest.finance (the “Site”) (b) other products running in the Forest Ecosystem that we release and announce
        from time to time. Therefore,
      </p>

      <p>
        YOU ALSO AGREE THAT, BY ACCESSING OR USING ANY OF THE PRODUCTS, YOU SIGNIFY THAT YOU HAVE READ, UNDERSTAND, AND
        AGREE TO BE BOUND BY THE TERMS IN ITS ENTIRETY. IF YOU DO NOT AGREE, OR YOU ARE NOT AUTHORIZED TO ACCESS OR USE
        ANY OF OUR PRODUCTS AND SHOULD NOT USE OUR PRODUCTS.
      </p>

      <p>
        Accordingly, you represent that you are at least the age of majority in your jurisdiction (e.g., 18 years old in
        Singapore) and have the full right, power, and authority to enter into and comply with the terms and conditions
        of this Terms on behalf of yourself and any company or legal entity for which you may access or use the
        Interface. If you are entering into this Terms on behalf of an entity, you represent to us that you have the
        legal authority to bind such entity. You further represent that you are not (a) the subject of economic or trade
        sanctions administered or enforced by any governmental authority or otherwise designated on any list of
        prohibited or restricted parties or (b) a citizen, resident, or organized in a jurisdiction or territory that is
        the subject of comprehensive country-wide, territory-wide, or regional economic sanctions by Singapore. Finally,
        you represent that your access and use of any of our Products will fully comply with all applicable laws and
        regulations, and that you will not access or use any of our Products to conduct, promote, or otherwise
        facilitate any illegal activity.
      </p>

      <p>
        NOTICE:{' '}
        <strong>
          This Terms contains important information, including a binding arbitration provision and a class action
          waiver, both of which impact your rights as to how disputes are resolved. Our Products are only available to
          you — and you should only access any of our Products including but not limited to the Site — if you agree
          completely with these terms.
        </strong>
      </p>

      <h1>1. Privacy Policy . </h1>
      <p>
        Please review our Privacy Policy, which also governs your use of the Services, for information on how we
        collect, use and share your information.{' '}
      </p>

      <h1>1. Changes to these Terms or the Products and Services . </h1>
      <p>
        We may update the Terms from time to time in our sole discretion. If we do, we'll let you know by posting the
        updated Terms on the Site and/or may also send other communications. It's important that you review the Terms
        whenever we update them or you use the Services. If you continue to use the Services after we have posted
        updated Terms, it means that you accept and agree to the changes. If you don't agree to be bound by the changes,
        you may not use the Services anymore. Because our Services are evolving over time, we may change or discontinue
        all or any part of the Services, at any time and without notice, at our sole discretion.
      </p>

      <h1>3. About the Services . </h1>
      <p>
        A. Forest . Forest is a decentralized and smart contract-powered digital art ecosystem operating on the AELF
        blockchain. eforest.finance (the “Site”) is a web-based display interface that helps users interact with the
        AELF blockchain through smart contracts. With eforest.finance , users can create, sell, buy, display and
        interact with digital art published to the AELF blockchain as non-fungible tokens (“NFTs”).{' '}
      </p>
      <ul className={styles['lower-roman']}>
        <li>
          <p>
            You may participate in the Services by linking your digital wallet(s) on supported bridge extensions, which
            allows you to purchase, store, and engage in transactions using cryptocurrency. Before putting up your
            unique digital asset for sale or putting in an offer to purchase a unique digital asset from another user,
            we will ask you to download a supported electronic wallet extension and connect and unlock your digital
            wallets with that extension. Once you submit an order to sell or purchase a unique digital asset, your order
            is passed on to the applicable extension, which completes the transaction on your behalf.
          </p>
          <li>
            <p>
              THE FOREST IS A PLATFORM. WE ARE NOT A BROKER, FINANCIAL INSTITUTION, OR CREDITOR. THE SERVICES ARE AN
              ADMINISTRATIVE PLATFORM ONLY. Forest FACILITATES TRANSACTIONS BETWEEN THE PURCHASER AND SELLER ON THE
              FOREST BUT IS NOT A PARTY TO ANY AGREEMENT BETWEEN THE PURCHASER AND SELLER OF NFTs OR BETWEEN ANY USERS.
            </p>
          </li>
          <li>
            <p>
              YOU BEAR FULL RESPONSIBILITY FOR VERIFYING THEmIDENTITY, LEGITIMACY, AND AUTHENTICITY OF ASSETS YOU
              PURCHASE THROUGH THE FORESTPLATFORM. NOTWITHSTANDING INDICATORS AND MESSAGES THAT SUGGEST VERIFICATION,
              Forest MAKES NO CLAIMS ABOUT THE IDENTITY, LEGITIMACY, OR AUTHENTICITY OF ASSETS ON THE PLATFORM.
            </p>
          </li>
        </li>
      </ul>

      <p>
        B. <strong className="underline underline-offset-4">Transactions Are Conducted on the Blockchain .</strong>{' '}
        While Forest offers a marketplace for NFTs, it does not buy, sell or take custody or possession of any NFTs, nor
        does it act as an agent or custodian for any user of the Services. You acknowledge that Forest does not take
        control or custody of any NFT or cryptocurrency at any time. If you elect to buy or sell any NFTs, any
        transactions that you engage in will be conducted solely through the relevant Blockchain network governing such
        NFT. You will be required to make or receive payments exclusively through the cryptocurrency wallet you have
        connected to the FOREST. We will have no insight into or control over these payments or transactions, nor do we
        have the ability to reverse any transactions. Accordingly, we will have no liability to you or to any third
        party for any claims or damages that may arise as a result of any transactions that you engage in via the
        Service. There may be royalties associated with the secondary sale of any NFT. You acknowledge and agree that
        the payment of any such royalty shall, in certain circumstances, be programmed to be self-executing via a
        blockchain network's nonfungible token standard and Forest does not have any control or ability to direct such
        funds or the obligation to collect such fees
      </p>

      <p>
        C. <strong className="underline underline-offset-4">Terms Applicable to Purchasers and Sellers.</strong> If you
        are using the Services to
      </p>

      <p>
        purchase NFTs, you are a “Purchaser,” and if you are using the Services to sell NFTs, you are a “Seller.” If you
        are either a Purchaser or Seller, you agree to the following additional terms:
      </p>

      <p className="ml-[3em]">
        (i) <strong>Purchase Terms.</strong> NFTs purchased or sold on the Forest are subject to terms directly between
        Purchasers and Sellers (e.g., with respect to the use of the NFT Content, as defined below, or benefits
        associated with a given NFT) (“Purchase Terms”). Forest is not a party to any such Purchase Terms, which are
        solely between the Purchaser and the Seller. The Purchaser and Seller are entirely responsible for
        communicating, promulgating, agreeing to, and enforcing Purchase Terms. Seller must comply with and fulfill the
        Purchase Terms with respect to any NFTs that it sells. When you purchase an NFT through the Services, you own
        all personal property rights to the electronic record that comprises the NFT (i.e., the right to sell or
        otherwise dispose of that NFT). Unless expressly specified in the Purchase Terms, such rights, however, do not
        include the ownership of the intellectual property rights in any digital art embodied in the NFTs, any name,
        likeness, image, signature, voice and other identifiable characteristics included in the digital art embodied in
        the NFTs, any creative assets, name, logos and trademarks associated with the NFTs, and all intellectual
        property rights in the foregoing (collectively, the “NFT Content”). Rather, unless specified otherwise in the
        Purchase Terms, you have a license to use the NFT Content solely for the following purposes: (1) for Purchaser's
        own personal, non-commercial use; (2) attempts to sell or otherwise dispose of the NFT consistent with the
        ownership of it; and (3) as part of a third party offering compatible with the purchased NFT in the normal
        course of the permitted end-use of such offering. If these Terms and the Purchase Terms (as defined below)
        conflict, the terms set forth in these Terms will prevail.
      </p>

      <p className="ml-[3em]">
        (ii) <strong>Costs and Fees.</strong> For its Service, Forest may receive certain fees. Forest does not set,
        collect, or determine other applicable costs, fees, and expenses associated with buying and selling an NFT,
        including but not limited to any creator earnings or transaction fees. These costs, fees, and expenses are paid
        directly to the seller, creator, payment processor, blockchain validator, or other third party, as applicable.
        Because these costs, fees, and expenses are not collected by Forest, it cannot refund them.{' '}
      </p>

      <p className="ml-[3em]">
        You agree to be solely responsible for and to pay all applicable fees, including transaction fees and service
        fees, and you authorize Forest to automatically charge you for any such fees or deduct such fees directly from
        your amounts paid by the Purchaser.
      </p>

      <p className="ml-[3em]">
        Each party shall also be responsible for all Taxes imposed on its income or property, and Forest shall have no
        responsibility for payment of such Taxes regardless of the taxing authority. “Transaction fees” mean the fees
        that fund the network of computers that run the decentralized blockchain network,meaning that you will need to
        pay a transaction fees for each transaction that occurs via the blockchain network. Although transactions on the
        Forest Marketplace are not currently subject to fees that Forest collects to support the NFT creators and Forest
        Marketplace, Forest reserves the right to implement fees on transactions on the Forest Marketplace in the
        future. If fees will be collected by Forest, such fees will be posted on the Site or otherwise set forth in
        these Terms.
      </p>

      <p>
        D. <strong>Taxes.</strong> You are solely responsible for all costs incurred by you in using the Services and
        determining, collecting, reporting and paying all applicable Taxes. As used herein, “Taxes” means the taxes,
        duties, levies, tariffs, and other governmental charges that you may be required by law to collect and remit to
        governmental agencies, and other similar municipal, state, federal and national indirect or other withholding
        and personal or corporate income taxes. You are solely responsible for maintaining all relevant Tax records and
        complying with any reporting requirements you may have as related to our Services. You are further solely
        responsible for independently maintaining the accuracy of any record submitted to any tax authority including
        any information derived from the Services. We reserve the right to report any activity occurring using the
        Services to relevant tax authorities as required under applicable law.
      </p>

      <p>
        E. <strong>Suspension or Termination.</strong> We may suspend or terminate your access to the Services at any
        time in connection with any transaction as required by applicable law, any governmental authority, or if we in
        our sole and reasonable discretion determine you are violating these Terms or the terms of any third-party
        service provider. Such suspension or termination shall not be constituted a breach of these Terms by Forest. In
        accordance with its anti-money laundering, anti-terrorism, anti-fraud, and other compliance policies and
        practices, we may impose reasonable limitations and controls on the ability of you or any beneficiary to utilize
        the Services. Such limitations may include where good cause exists, rejecting transaction requests, freezing
        funds, or otherwise restricting you from using the Services.
      </p>

      <ol>
        <li>
          <p>
            4. <strong>Feedback.</strong> We appreciate feedback, comments, ideas, proposals and suggestions for
            improvements to the Services (“Feedback”). If you choose to submit Feedback, you agree that we are free to
            use it without any restriction or compensation to you.
          </p>
        </li>
      </ol>

      <h1>1. Your Content .</h1>
      <p>
        A. <strong className="underline underline-offset-4">Posting Content .</strong> Our Services may allow you to
        store or share content such as text (in posts or communications with others), files, documents, graphics,
        images, music, software, audio and video. Anything (other than Feedback) that you post or otherwise make
        available through the Services is referred to as “User Content”. User Content may include the NFT Content.
        Forest does not claim any ownership rights in any User Content and nothing in these Terms will be deemed to
        restrict any rights that you may have to your User Content.{' '}
      </p>

      <p>
        B. <strong className="underline underline-offset-4">Permissions to Your User Content .</strong> By making any
        User Content available through the Services, you hereby grant to Forest a non-exclusive, transferable,
        worldwide, royalty-free license, with the right to sublicense, to use, copy, modify, create derivative works
        based upon, distribute, publicly display, and publicly perform your User Content in connection with operating
        and providing the Services.{' '}
      </p>

      <p>
        C. <strong className="underline underline-offset-4">Your Responsibility for User Content .</strong> You are
        solely responsible for all your User Content. You represent and warrant that you have (and will have) all rights
        that are necessary to grant us the license rights in your User Content under these Terms. You represent and
        warrant that neither your User Content, nor your use and provision of your User Content to be made available
        through the Services, nor any use of your User Content by Forest on or through the Services will infringe,
        misappropriate or violate a third party's intellectual property rights, or rights of publicity or privacy, or
        result in the violation of any applicable law or regulation.{' '}
      </p>

      <p>
        D. <strong className="underline underline-offset-4">Removal of User Content .</strong> You can remove certain of
        your User Content by specifically deleting it. You should know that in certain instances, some of your User
        Content (such as posts or comments you make, or your NFT Content) may not be completely removed and copies of
        your User Content may continue to exist on the Services or NFT. To the maximum extent permitted by law, we are
        not responsible or liable for the removal or deletion of (or the failure to remove or delete) any of your User
        Content.{' '}
      </p>

      <p>
        E. <strong className="underline underline-offset-4">Forest's Intellectual Property .</strong> We may make
        available through the Services content that is subject to intellectual property rights. We retain all rights to
        that content.{' '}
      </p>

      <h1>6. Acceptable Use Policy and Forest's Enforcement Rights . You agree not to do any of the following: </h1>
      <ul>
        <li>
          <p>
            Post, upload, publish, submit or transmit any User Content that: (i) infringes, misappropriates or violates
            a third party's patent, copyright, trademark, trade secret, moral rights or other intellectual property
            rights, or rights of publicity or privacy; (ii) violates, or encourages any conduct that would violate, any
            applicable law or regulation or would give rise to civil liability; (iii) is fraudulent, false, misleading
            or deceptive; (iv) is defamatory, obscene, pornographic, vulgar or offensive; (v) promotes discrimination,
            bigotry, racism, hatred, harassment or harm against any individual or group; (vi) is violent or threatening
            or promotes violence or actions that are threatening to any person or entity; or (vii) promotes illegal or
            harmful activities or substances;
          </p>
        </li>
        <li>
          <p>
            Use, display, mirror or frame the Services or any individual element within the Services, Forest 's name,
            any Forest trademark, logo or other proprietary information, or the layout and design of any page or form
            contained on a page, without Forest 's express written consent;
          </p>
        </li>
        <li>
          <p>
            Access, tamper with, or use non-public areas of the Services, Forest 's computer systems, or the technical
            delivery systems of Forest 's providers;
          </p>
        </li>

        <li>
          <p>
            Attempt to probe, scan or test the vulnerability of any Forest system or network or breach any security or
            authentication measures;
          </p>
        </li>

        <li>
          <p>
            Avoid, bypass, remove, deactivate, impair, descramble or otherwise circumvent any technological measure
            implemented by Forest or any of Forest 's providers or any other third party (including another user) to
            protect the Services;
          </p>
        </li>

        <li>
          <p>
            Attempt to access or search the Services or download content from the Services using any engine, software,
            tool, agent, device or mechanism (including spiders, robots, crawlers, data mining tools or the like) other
            than the software and/or search agents provided by Forest or other generally available third-party web
            browsers;
          </p>
        </li>

        <li>
          <p>
            Send any unsolicited or unauthorized advertising, promotional materials, email, junk mail, spam, chain
            letters or other form of solicitation;
          </p>
        </li>

        <li>
          <p>
            Use the Services, or any portion thereof, for any commercial purpose or for the benefit of any third party
            or in any manner not permitted by these Terms;
          </p>
        </li>

        <li>
          <p>
            Forge any TCP/IP packet header or any part of the header information in any email or newsgroup posting, or
            in any way use the Services to send altered, deceptive or false source-identifying information;
          </p>
        </li>

        <li>
          <p>
            Attempt to decipher, decompile, disassemble or reverse engineer any of the software used to provide the
            Services;
          </p>
        </li>

        <li>
          <p>
            Interfere with, or attempt to interfere with, the access of any user, host or network, including, without
            limitation, sending a virus, overloading, flooding, spamming, or mailbombing the Services;
          </p>
        </li>

        <li>
          <p>
            Collect or store any personally identifiable information from the Services from other users of the Services
            without their express permission;
          </p>
        </li>

        <li>
          <p> Impersonate or misrepresent your affiliation with any person or entity; </p>
        </li>

        <li>
          <p> Create or list counterfeit items (including any NFTs); </p>
        </li>
      </ul>
      <p>
        Engage or assist in any activity that violates any law, statute, ordinance, regulation, or sanctions program,
        including but not limited to the U.S. Department of Treasury's Office of Foreign Assets Control (“OFAC”), or
        that involves proceeds of any unlawful activity (including but not limited to money laundering, terrorist
        financing or deliberately engaging in activities designed to adversely affect the performance of the Services);{' '}
      </p>
      <ul className={styles['lower-roman']}>
        <li>
          <p> Engage in wash trading or other deceptive or manipulative trading activities.</p>
        </li>
        <li>
          <p>
            Use the Services to participate in fundraising for a business, protocol, or platform, including but not
            limited to creating, listing, or buying assets that are redeemable for financial instruments, assets that
            give owners the rights to participate in an ICO or any securities offering, or assets that entitle owners to
            financial rewards, including but not limited to, DeFi (or decentralized finance) yield bonuses, staking
            bonuses, and burn discounts;
          </p>
        </li>
      </ul>
      <p> Fabricate in any way any transaction or process related thereto;</p>
      <p>
        Place misleading bids or offers; (t) Disguise or interfere in any way with the IP address of the computer you
        are using to access or use the Services or that otherwise prevents us from correctly identifying the IP address
        of the computer you are using to access the Services;
      </p>
      <p>
        Transmit, exchange, or otherwise support the direct or indirect proceeds of criminal or fraudulent activity;
      </p>
      <p> Violate any applicable law or regulation; or</p>
      <p>
        Encourage or enable any other individual to do any of the foregoing. Forest is not obligated to monitor access
        to or use of the Services or to review or edit any content. However, we have the right to do so for the purpose
        of operating the Services, to ensure compliance with these Terms and to comply with applicable law or other
        legal requirements. We reserve the right, but are not obligated, to remove or disable access to any content,
        including User Content, at any time and without notice, including, but not limited to, if we, at our sole
        discretion, consider it objectionable or in violation of these Terms. We have the right to investigate
        violations of these Terms or conduct that affects the Services. We may also consult and cooperate with law
        enforcement authorities to prosecute users who violate the law. The sale of stolen assets, assets taken without
        authorization, and otherwise illegally obtained assets on the Service is prohibited. If you have reason to
        believe that an asset listed on the Service was illegally obtained, please contact us immediately. Listing
        illegally obtained assets may result in your listings being cancelled, your assets being hidden, or you being
        suspended from the Services.
      </p>

      <h1>7. Copyright Policy . </h1>
      <p>
        Forest respects copyright law and expects its users to do the same. It is Forest 's policy to terminate in
        appropriate circumstances users who repeatedly infringe or are believed to be repeatedly infringing the rights
        of copyright holders.
      </p>

      <h1>8. Links to Third Party Websites or Resources .</h1>

      <p>
        The Services may allow you to access third-party websites or other resources. We provide access only as a
        convenience and are not responsible for the content, products or services on or available from those resources
        or links displayed on such websites. You acknowledge sole responsibility for and assume all risk arising from,
        your use of any third-party resources.{' '}
      </p>

      <h1>9. Termination . </h1>

      <p>
        We may suspend or terminate your access to and use of the Services at our sole discretion, at any time and
        without notice to you. You may disconnect your digital wallet at any time. You acknowledge and agree that we
        shall have no liability or obligation to you in such event and that you will not be entitled to a refund of any
        amounts that you have already paid to us or any third party, to the fullest extent permitted by applicable law.
        Upon any termination, discontinuation or cancellation of the Services, the following Sections will survive:
        breach of any sections that related to payments due and owing to Forest prior to the termination, 6(b), 6(c),
        6(e), 7, 10, 11, 13, 14, 15, 16 and17.{' '}
      </p>

      <h1>10. Warranty Disclaimers .</h1>

      <p>
        THE SERVICES, ANY CONTENT CONTAINED THEREIN, AND ANY NFTS (INCLUDING ASSOCIATED NFT CONTENT) LISTED THEREIN ARE
        PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR
        IMPLIED. FOREST (AND ITS SUPPLIERS) MAKE NO WARRANTY THAT THE SERVICES: (I) WILL MEET YOUR REQUIREMENTS; (II)
        WILL BE AVAILABLE ON AN UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS; OR (III) WILL BE ACCURATE, RELIABLE,
        COMPLETE, LEGAL, OR SAFE. FOREST DISCLAIMS ALL OTHER WARRANTIES OR CONDITIONS, EXPRESS OR IMPLIED, INCLUDING,
        WITHOUT LIMITATION, INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
        QUIET ENJOYMENT OR NONINFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AS TO THE SERVICES, ANY
        CONTENT CONTAINED THEREIN AND ANY NFTS LISTED THEREIN.{' '}
      </p>

      <p>
        WE FURTHER EXPRESSLY DISCLAIM ALL LIABILITY OR RESPONSIBILITY IN CONNECTION WITH THIRD PARTY SERVICES. NOTHING
        HEREIN NOR ANY USE OF OUR SERVICES IN CONNECTION WITH THIRD PARTY SERVICES CONSTITUTES OUR ENDORSEMENT,
        RECOMMENDATION OR ANY OTHER AFFILIATION OF OR WITH ANY THIRD PARTY SERVICES.{' '}
      </p>

      <p>
        FOREST DOES NOT REPRESENT OR WARRANT THAT ANY CONTENT ON THE SERVICES IS ACCURATE, COMPLETE, RELIABLE, CURRENT
        OR ERROR-FREE. WE WILL NOT BE LIABLE FOR ANY LOSS OF ANY KIND FROM ANY ACTION TAKEN OR TAKEN IN RELIANCE ON
        MATERIAL OR INFORMATION, CONTAINED ON THE SERVICES. WHILE FOREST ATTEMPTS TO MAKE YOUR ACCESS TO AND USE OF THE
        SERVICES AND ANY CONTENT THEREIN SAFE, FOREST CANNOT AND DOES NOT REPRESENT OR WARRANT THAT THE SERVICES, ANY
        CONTENT THEREIN, ANY NFTS LISTED THEREIN, OR OUR SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE
        CANNOT GUARANTEE THE SECURITY OF ANY DATA THAT YOU DISCLOSE ONLINE. YOU ACCEPT THE INHERENT SECURITY RISKS OF
        PROVIDING INFORMATION AND DEALING ONLINE OVER THE INTERNET AND WILL NOT HOLD US RESPONSIBLE FOR ANY BREACH OF
        SECURITY. FOREST WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSS AND TAKES NO RESPONSIBILITY FOR, AND WILL
        NOT BE LIABLE TO YOU FOR, ANY USE OF THE SERVICES, INCLUDING BUT NOT LIMITED TO ANY LOSSES, DAMAGES OR CLAIMS
        ARISING FROM: (I) USER ERROR SUCH AS FORGOTTEN PASSWORDS, INCORRECTLY CONSTRUCTED TRANSACTIONS, OR MISTYPED
        WALLET ADDRESSES; (II) SERVER FAILURE OR DATA LOSS; (III) BLOCKCHAIN NETWORKS, CRYPTOCURRENCY WALLETS OR CORRUPT
        FILES; (IV) UNAUTHORIZED ACCESS TO SERVICES; OR (V) ANY THIRD PARTY ACTIVITIES, INCLUDING WITHOUT LIMITATION THE
        USE OF VIRUSES, PHISHING, BRUTE FORCING OR OTHER MEANS OF ATTACK.{' '}
      </p>

      <p>
        NFTS ARE INTANGIBLE DIGITAL ASSETS. THEY EXIST ONLY BY VIRTUE OF THE OWNERSHIP RECORD MAINTAINED IN THE
        APPLICABLE BLOCKCHAIN NETWORK. ANY TRANSFER OF TITLE THAT MIGHT OCCUR IN ANY UNIQUE DIGITAL ASSET OCCURS ON THE
        DECENTRALIZED LEDGER WITHIN SUCH BLOCKCHAIN NETWORK. WE DO NOT GUARANTEE THAT WE CAN EFFECT THE TRANSFER OF
        TITLE OR RIGHT IN ANY NFTS OR OTHER DIGITAL ASSETS, OR THAT ANY ASSOCIATED PAYMENT WILL BE SUCCESSFUL. YOU BEAR
        FULL RESPONSIBILITY FOR VERIFYING THE IDENTITY, LEGITIMACY, AND AUTHENTICITY OF ASSETS YOU PURCHASE THROUGH THE
        SERVICES. NOTWITHSTANDING INDICATORS AND MESSAGES THAT SUGGEST VERIFICATION, FOREST MAKES NO CLAIMS ABOUT THE
        IDENTITY, LEGITIMACY, OR AUTHENTICITY OF ASSETS ON THE SERVICES. THE SERVICES MAY NOT BE AVAILABLE DUE TO ANY
        NUMBER OF FACTORS INCLUDING, BUT NOT LIMITED TO, PERIODIC SYSTEM MAINTENANCE, SCHEDULED OR UNSCHEDULED, ACTS OF
        GOD, UNAUTHORIZED ACCESS, VIRUSES, DENIAL OF SERVICE OR OTHER ATTACKS,TECHNICAL FAILURE OF THE SERVICES AND/OR
        TELECOMMUNICATIONS INFRASTRUCTURE OR DISRUPTION, AND THEREFORE WE EXPRESSLY DISCLAIM ANY EXPRESS OR IMPLIED
        WARRANTY REGARDING THE USE AND/OR AVAILABILITY, ACCESSIBILITY, SECURITY OR PERFORMANCE OF THE SERVICES CAUSED BY
        SUCH FACTORS. WE DO NOT MAKE ANY REPRESENTATIONS OR WARRANTIES AGAINST THE POSSIBILITY OF DELETION, MISDELIVERY
        OR FAILURE TO STORE COMMUNICATIONS, PERSONALIZED SETTINGS OR OTHER DATA. SOME JURISDICTIONS DO NOT ALLOW THE
        EXCLUSION OF CERTAIN WARRANTIES. ACCORDINGLY, SOME OF THE ABOVE DISCLAIMERS OF WARRANTIES MAY NOT APPLY TO YOU.{' '}
      </p>

      <h1>11. Assumption of Risk . </h1>

      <p>You accept and acknowledge:</p>
      <ul>
        <li>
          <p>
            The prices and liquidity of cryptocurrency assets (including any NFTs) are extremely volatile. Fluctuations
            in the price of other digital assets could materially and adversely affect the NFTs made available through
            the Services, which may also be subject to significant price volatility. We cannot guarantee that any
            Purchasers of NFTs will not lose money.
          </p>
        </li>
        <li>
          <p>
            You are solely responsible for determining what, if any, Taxes apply to your transactions through the
            Services. Neither Forest nor any Forest affiliates are responsible for determining the Taxes that apply to
            such transactions.
          </p>
        </li>

        <li>
          <p>
            Our Services do not store, send, or receive cryptocurrency assets. This is because cryptocurrency assets
            exist only by virtue of the ownership record maintained on its supporting Blockchain. Any transfer of
            cryptocurrency assets occurs within the supporting Blockchain and not on the Services. Transactions in NFTs
            may be irreversible, and, accordingly, losses due to fraudulent or accidental transactions may not be
            recoverable. Some transactions in NFTs shall be deemed to be made when recorded on a public ledger, which is
            not necessarily the date or time that you initiated the transaction.
          </p>
        </li>

        <li>
          <p>
            There are risks associated with using an Internet based currency, including but not limited to, the risk of
            hardware, software and Internet connections, the risk of malicious software introduction, and the risk that
            third parties may obtain unauthorized access to information stored within your wallet. You accept and
            acknowledge that Forest will not be responsible for any communication failures, disruptions, errors,
            distortions or delays you may experience when using the Services for transactions, however caused.
          </p>
        </li>

        <li>
          <p>
            A lack of use or public interest in the creation and development of distributed ecosystems could negatively
            impact the development of those ecosystems and related applications, and could therefore also negatively
            impact the potential utility or value of a certain NFT.
          </p>
        </li>

        <li>
          <p>
            The Services may rely on third-party platforms to perform transactions with respect to any cryptocurrency
            assets. If we are unable to maintain a good relationship with such platform providers; if the terms and
            conditions or pricing of such platform providers change; if we violate or cannot comply with the terms and
            conditions of such platforms; or if any of such platforms loses market share or falls out of favor or is
            unavailable for a prolonged period of time, access to and use of the Services will suffer.
          </p>
        </li>

        <li>
          <p>
            There are risks associated with purchasing user generated content, including but not limited to, the risk of
            purchasing counterfeit assets, mislabeled assets, assets that are vulnerable to metadata decay, assets on
            smart contracts with bugs, and assets that may become untransferable. Forest reserves the right to hide
            collections, contracts, and assets affected by any of these issues or by other issues. Assets you purchase
            may become inaccessible on Forest . Under no circumstances shall the inability to view or access your assets
            on Forest serve as grounds for a claim against Forest .
          </p>
        </li>

        <li>
          <p>
            By accessing and using the Services, you represent that you understand the inherent risks associated with
            using cryptographic and blockchain-based systems, and that you have a working knowledge of digital assets.
            Such systems may have vulnerabilities or other failures, or other abnormal behavior. Forest is not
            responsible for any issues with the Blockchains, including forks, technical node issues or any other issues
            having fund losses as a result. You acknowledge that the cost and speed of transacting with cryptographic
            and blockchain-based systems such as AELF are variable and may increase at any time. You further acknowledge
            the risk that your digital assets may lose some or all of their value while they are supplied to or from the
            Services. You further acknowledge that we are not responsible for any of these variables or risks and cannot
            be held liable for any resulting losses that you experience while accessing Services. Accordingly, you
            understand and agree to assume full responsibility for all of the risks of accessing and using and
            interacting with the Services.
          </p>
        </li>
      </ul>

      <h1>12. Indemnity .</h1>

      <p>
        You will indemnify, defend (at Forest 's option) and hold Forest and its officers, directors, employees and
        agents, harmless from and against any claims, disputes, demands, liabilities, damages, losses, and costs and
        expenses, including, without limitation, reasonable legal and accounting fees arising out of or in any way
        connected with (a) your access to or use of the Services, (b) your NFT Content, or (c) your violation of these
        Terms. You may not settle or otherwise compromise any claim subject to this Section without Forest 's prior
        written approval.{' '}
      </p>

      <h1> 13. Limitation of Liability. </h1>

      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER FOREST NOR ITS SERVICE PROVIDERS INVOLVED IN CREATING,
        PRODUCING, OR DELIVERING THE SERVICES WILL BE LIABLE FOR ANY INCIDENTAL, SPECIAL, EXEMPLARY OR CONSEQUENTIAL
        DAMAGES, OR DAMAGES FOR LOST PROFITS, LOST REVENUES, LOST SAVINGS, LOST BUSINESS OPPORTUNITY, LOSS OF DATA OR
        GOODWILL, SERVICE INTERRUPTION, COMPUTER DAMAGE OR SYSTEM FAILURE OR THE COST OF SUBSTITUTE SERVICES OF ANY KIND
        ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR FROM THE USE OF OR INABILITY TO USE THE SERVICES, WHETHER
        BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), PRODUCT LIABILITY OR ANY OTHER LEGAL THEORY, AND
        WHETHER OR NOT FOREST OR ITS SERVICE PROVIDERS HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, EVEN IF A
        LIMITED REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE. SOME JURISDICTIONS DO NOT
        ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, SO THE ABOVE LIMITATION
        MAY NOT APPLY TO YOU.{' '}
      </p>

      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE AGGREGATE TOTAL LIABILITY OF FOREST AND ITS AGENTS,
        REPRESENTATIVES, AND AFFILIATES ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR FROM THE USE OF OR INABILITY
        TO USE THE SERVICES EXCEED THE AMOUNTS YOU HAVE PAID OR ARE PAYABLE BY YOU TO FOREST FOR USE OF THE SERVICES OR
        ONE HUNDRED U.S. DOLLARS ($100), IF YOU HAVE NOT HAD ANY PAYMENT OBLIGATIONS TO FOREST, AS APPLICABLE.{' '}
      </p>

      <p>
        THE EXCLUSIONS AND LIMITATIONS OF DAMAGES SET FORTH ABOVE ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE BARGAIN
        BETWEEN FOREST AND YOU.{' '}
      </p>

      <h1>14. Governing Law and Forum Choice . </h1>
      <p>
        These Terms and any action related thereto will be governed by the British Virgin Islands Arbitration Act and
        the laws of the British Virgin Islands, without regard to its conflict of laws provisions. Except as otherwise
        expressly set forth in Section 16 “Dispute Resolution,” the exclusive jurisdiction for all Disputes (defined
        below) that you and Forest are not required to arbitrate will be the courts located in the British Virgin
        Islands, and you and Forest each waive any objection to jurisdiction and venue in such courts.{' '}
      </p>

      <h1>15. Dispute Resolution .</h1>

      <ul>
        <li>
          <p>
            Informal Resolution of Disputes . We will use our best efforts to resolve any potential disputes through
            informal, good fai th negotiations. If a potential dispute arises, you must contact us by sending an email
            to info@eforest.finance so that we can attempt to resolve it without resorting to formal dispute resolution.
            If we aren't able to reach an informal resolution within sixty days of your email, then you and we both
            agree to resolve the potential dispute according to the process set forth below.
          </p>
        </li>
        <li>
          <p>
            Mandatory Arbitration of Disputes . We each agree that any Dispute will be resolved solely by binding,
            individual arbitration and not in a class, representative or consolidated action or proceeding. You and
            Forest that the British Virgin Islands Arbitration Act governs the interpretation and enforcement of these
            Terms, and that you and Forest are each waiving the right to a trial by jury or to participate in a class
            action. This arbitration provision shall survive termination of these Terms.
          </p>
        </li>
        <li>
          <p>
            Exceptions . As limited exceptions to Section 16(a) above: (i) we both may seek to resolve a Dispute in
            small claims court if it qualifies; and (ii) we each retain the right to seek injunctive or other equitable
            relief from a court to prevent (or enjoin) the infringement or misappropriation of our intellectual property
            rights.
          </p>
        </li>
        <li>
          <p>
            Conducting Arbitration and Arbitration Rules . The arbitration will be conducted by JAMS under its JAMS
            Comprehensive Arbitration Rules and Procedures (the “JAMS Rules”) then in effect, except as modified by
            these Terms. The JAMS Rules are available at https://www.jamsadr.com/. A party who wishes to start
            arbitration must submit a written Demand for Arbitration to JAMS and give notice to the other party as
            specified in the JAMS Rules. JAMS provides a form Demand for Arbitration at https:// www.jamsadr.com/. Any
            arbitration hearings will take place in the county (or parish) where you live, unless we both agree to a
            different location, but will be conducted remotely to the extent permitted by the JAMS Rules. The parties
            agree that the arbitrator shall have exclusive authority to decide all issues relating to the
            interpretation, applicability, enforceability and scope of this arbitration agreement.
          </p>
        </li>

        <li>
          <p>
            1. Arbitration Costs . Payment of all filing, administration and arbitrator fees will be governed by the
            JAMS Rules, and we won't seek to recover the administration and arbitrator fees we are responsible for
            paying, unless the arbitrator finds your Dispute frivolous. If we prevail in arbitration, we'll pay all of
            our attorneys' fees and costs and won't seek to recover them from you. If you prevail in arbitration you
            will be entitled to an award of attorneys' fees and expenses to the extent provided under applicable law.
          </p>
        </li>

        <li>
          <p>
            Injunctive and Declaratory Relief . Except as provided in Section 16(c) above, the arbitrator shall
            determine all issues of liability on the merits of any claim asserted by either party and may award
            declaratory or injunctive relief only in favor of the individual party seeking relief and only to the extent
            necessary to provide relief warranted by that party's individual claim. To the extent that you or we prevail
            on a claim and seek public injunctive relief (that is, injunctive relief that has the primary purpose and
            effect of prohibiting unlawful acts that threaten future injury to the public), the entitlement to and
            extent of such relief must be litigated in a civil court of competent jurisdiction and not in arbitration.
            The parties agree that litigation of any issues of public injunctive relief shall be stayed pending the
            outcome of the merits of any individual claims in arbitration.
          </p>
        </li>

        <li>
          <p>
            Class Action Waiver . YOU AND Forest AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS
            INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE
            PROCEEDING. Further, if the parties' Dispute is resolved through arbitration, the arbitrator may not
            consolidate another person's claims with your claims, and may not otherwise preside over any form of a
            representative or class proceeding. If this specific provision is found to be unenforceable, then the
            entirety of this Dispute Resolution section shall be null and void.
          </p>
        </li>

        <li>
          <p>
            Severability . With the exception of any of the provisions in Section 16(g) of these Terms (“Class Action
            Waiver”), if an arbitrator or court of competent jurisdiction decides that any part of these Terms is
            invalid or unenforceable, the other parts of these Terms will still apply.
          </p>
        </li>
      </ul>

      <h1>16. General Terms .</h1>

      <ol>
        <li>
          <p>
            Reservation of Rights . Forest and its licensors exclusively own all right, title and interest in and to the
            Services, including all associated intellectual property rights. You acknowledge that the Services are
            protected by copyright, trademark, and other laws of the United States and foreign countries. You agree not
            to remove, alter or obscure any copyright, trademark, service mark or other proprietary rights notices
            incorporated in or accompanying the Services.
          </p>
        </li>
        <li>
          <p>
            Entire Agreement . These Terms constitute the entire and exclusive understanding and agreement between
            Forest and you regarding the Services, and these Terms supersede and replace all prior oral or written
            understandings or agreements between Forest and you regarding the Services. If any provision of these Terms
            is held invalid or unenforceable by an arbitrator or a court of competent jurisdiction, that provision will
            be enforced to the maximum extent permissible, and the other provisions of these Terms will remain in full
            force and effect. Except where provided by applicable law in your jurisdiction, you may not assign or
            transfer these Terms, by operation of law or otherwise, without Forest 's prior written consent. Any attempt
            by you to assign or transfer these Terms absent our consent or your statutory right, without such consent,
            will be null. Forest may freely assign or transfer these Terms without restriction. Subject to the
            foregoing, these Terms will bind and inure to the benefit of the parties, their successors and permitted
            assigns.
          </p>
        </li>
        <li>
          <p>
            Notices . Any notices or other communications provided by Forest under these Terms will be given: (i) via
            email; or (ii) by posting to the Services. For notices made by email, the date of receipt will be deemed the
            date on which such notice is transmitted.
          </p>
        </li>
        <li>
          <p>
            Waiver of Rights. Forest's failure to enforce any right or provision of these Terms will not be considered a
            waiver of such right or provision. The waiver of any such right or provision will be effective only if in
            writing and signed by a duly authorized representative of Forest . Except as expressly set forth in these
            Terms, the exercise by either party of any of its remedies under these Terms will be without prejudice to
            its other remedies under these Terms or otherwise.
          </p>
        </li>
      </ol>

      <h1>17. Contact Information.</h1>

      <p>If you have any questions about these Terms of the Services, please contact Forest at info@eforest.finance.</p>
    </div>
  );
}
