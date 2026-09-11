# Google Sheets RSVP

The invitation is connected to the Apps Script `/exec` URL you supplied in `src/config/wedding.ts` → `rsvp.endpoint`. A real browser submission on 11 September 2026 returned `status: "ok"` and displayed the confirmation. The sheet itself was not opened by the coding agent.

Delete the test row named **TEST — website connection check — please delete**. It has attendance No, zero guests, no phone/email, and a message identifying it as a website test.

## Your sheet

Use these seven column headings, in this order:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Email | Attending | Guests | Message |

Name and attendance are required. Phone, email and message are optional. Guests includes the person replying and is zero for a decline. The timestamp is written by Google; set the spreadsheet timezone to India if desired.

Your supplied script is preserved in `google-apps-script/Code.gs`. It uses the spreadsheet bound to the script and its active tab. Keep that tab as the intended response destination; for a multi-tab workbook, replace `getActiveSheet()` with `getSheetByName("your exact response tab name")` and redeploy.

## Creating this setup again

1. Create a blank Google Sheet and enter the seven headings in row 1.
2. In that sheet, choose **Extensions → Apps Script**. Paste `google-apps-script/Code.gs` and save.
3. Choose **Deploy → New deployment → Web app**. Execute as **Me**, allow **Anyone**, authorize the requested spreadsheet access, then deploy. Keep the spreadsheet itself private.
4. Copy the URL ending in `/exec` into `rsvp.endpoint` in the website config. Rebuild and push the website.
5. After editing an existing script, choose **Deploy → Manage deployments → Edit → New version → Deploy**. This keeps the same endpoint. Merely saving code does not update an existing production deployment.

This uses Google Apps Script; Google App Engine is not needed. Official guidance: https://developers.google.com/apps-script/guides/web and https://developers.google.com/apps-script/guides/content.

## Confirmation and errors

The form sends JSON as a simple `text/plain` POST, follows Google's response redirect, and shows success only after reading `status: "ok"`. It prevents double clicks during submission. It preserves the form on errors and never automatically retries: the supplied script appends a row on each request, so a lost confirmation can otherwise create duplicates. Guests are told to check with the couple before resending an uncertain reply.

A successful HTTP test is not a spam filter. The public web-app endpoint accepts submissions independently of the website's field validation. The included script is your original version; server-side validation and abuse controls have not been added to your deployed Google project.
