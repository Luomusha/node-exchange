import * as ews from "ews-javascript-api";
import { XhrApi } from "@ewsjs/xhr";
import dotenv from "dotenv"

dotenv.config()

const USERNAME = process.env.USERNAME || "chuanpeng1.zhu"
const PASSWORD = process.env.PASSWORD || "**************"

const main = async () => {
    const exch = new ews.ExchangeService(ews.ExchangeVersion.Exchange2010_SP2);
    const url = "http://localhost:3000/EWS/Exchange.asmx"

    exch.Credentials = new ews.WebCredentials(USERNAME, PASSWORD)
    exch.Url = new ews.Uri(url)
    const xhr = new XhrApi({ headers: { gzip: true }, rejectUnauthorized: false })
        .useNtlmAuthentication(USERNAME, PASSWORD);
    exch.XHRApi = xhr;

    {
        const startDate = new ews.DateTime('2023-09-01T00:00:00');
        const endDate = new ews.DateTime('2023-11-11T23:59:59');
        const calendarView = new ews.CalendarView(startDate, endDate);
        exch.FindItems(ews.WellKnownFolderName.Calendar, calendarView)
            .then(function (result: ews.FindItemsResults<ews.Item>) {
                console.log("获取日程：=========", result.Items.length)
            }, function (errors) {
                console.log(errors)
            });
    }
    // {
    //     const view = new ews.ItemView(10);
    //     exch.FindItems(ews.WellKnownFolderName.Outbox, view)
    //         .then(function (result: ews.FindItemsResults<ews.Item>) {
    //             console.log("获取邮件：=========", result.Items.length)
    //         }, function (errors) {
    //             console.log(errors)
    //         });
    // }
}

main()