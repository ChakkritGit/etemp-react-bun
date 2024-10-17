import { LogSpan } from "../../style/components/log.update"

export default function Log() {
  return (
    <div className="p-2">
      <h2>Change Log</h2>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.1-OC17</b> <span>17/10/67</span></LogSpan>
      <ul className="mt-2">
        <li>Remove the PWA and Service Worker to resolve the white screen issue after the new version is released and to improve performance.</li>
        <li>Bug fixes.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.1</b> <span>03/10/67</span></LogSpan>
      <ul className="mt-2">
        <li>Bug fixes.</li>
        <li>Improve performance.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0</b> <span>17/07/67</span></LogSpan>
      <ul className="mt-2">
        <li>Release stable version.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JL17</b> <span>17/07/67</span></LogSpan>
      <ul className="mt-2">
        <li>Updated the default device selected on the dashboard.</li>
        <li>Updated notification popup to only show for users registered with a hospital.</li>
        <li>Fixed layout to support tablet responsiveness.</li>
        <li>Updated user role permissions and authorization system.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JL16</b> <span>16/07/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed layout issues.</li>
        <li>Bug fixes.</li>
        <li>Added move sequence device.</li>
        <li>Added navigate card action in the dashboard.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JL07</b> <span>07/07/67</span></LogSpan>
      <ul className="mt-2">
        <li>Security updates.</li>
        <li>Bug fixes.</li>
        <li>Performance enhancements.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JL01</b> <span>01/07/67</span></LogSpan>
      <ul className="mt-2">
        <li>Remember to select hospital and ward when filtering from the show all box page.</li>
        <li>Added firmware manager and patch OTA (over the air).</li>
        <li>Added colors and optimized chart performance.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JN17</b> <span>17/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Added animate transition.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JN16</b> <span>16/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Added responsive bottom navigation.</li>
        <li>Added more languages: Chinese and Japanese.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JN14</b> <span>14/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed image layout for object-fit: contain and cover.</li>
        <li>Fixed service worker cache memory (PWA).</li>
        <li>Added translation coverage.</li>
        <li>Added notification sound settings.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JN13</b> <span>13/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Added filtering of the list of problematic devices throughout the day when clicking on a card.</li>
        <li>Added notification read choice in the notification modal.</li>
        <li>Added a shortcut when clicking a card to navigate to the [adjust, warranties, repair] page.</li>
        <li>Added a history page.</li>
        <li>Fixed an issue with door opening errors.</li>
        <li>Fixed an issue with the language translator.</li>
        <li>Optimized PWA the website can still be used when offline.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JN10</b> <span>10/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Added a notification that floats to the bottom right corner.</li>
      </ul>
      <LogSpan className="mt-3 mw-50"><b>Version 1.0.0-JN8</b> <span>08/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed an issue with box activity counting.</li>
        <li>Optimized support for responsive mobile resolution.</li>
      </ul>
      <LogSpan className="mt-3"><b>Version 1.0.0-JN7</b> <span>07/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Fixed an issue with data duplication in charts.</li>
      </ul>
      <LogSpan className="mt-3"><b>Version 1.0.0-JN6</b> <span>06/06/67</span></LogSpan>
      <ul className="mt-2">
        <li>Bug fixes.</li>
        <li>Performance enhancements.</li>
      </ul>
    </div>
  )
}
