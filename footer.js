const footerHTML = `
<footer>
  <div class="footer-logo">Future<em>Proof</em></div>
  <div class="footer-copy">© 2026 FutureProof. All rights reserved.</div>
  <div class="footer-links">
    <a href="terms.html">Terms of Service</a>
    <a href="privacy.html">Privacy Policy</a>
    <a href="cookies.html">Cookie Policy</a>
    <a href="legal.html">Legal Notice</a>
  </div>
</footer>
`;

// This finds the placeholder div and inserts the HTML inside it
document.getElementById("footer-placeholder").innerHTML = footerHTML;
