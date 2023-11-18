const ews = require("ews-javascript-api");
const { XhrApi } =  require("@ewsjs/xhr");
const dotenv = require("dotenv")

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
            .then(function (result) {
                console.log("获取日程：=========", result.Items.length)
                result.Items.forEach(appointment => {
                    console.log('Subject:', appointment.Subject);
                    // @ts-ignore
                    console.log('Start Time:', appointment.Start.toString());
                    // @ts-ignore
                    console.log('End Time:', appointment.End.toString());
                })
            }, function (errors) {
                console.log(errors)
            });
    }

    // {
    //     const view = new ews.ItemView(10);
    //     exch.FindItems(ews.WellKnownFolderName.Inbox, view)
    //         .then(function (result: ews.FindItemsResults<ews.Item>) {
    //             console.log("获取邮件：=========", result.Items.length)
    //             result.Items.forEach(item => {
    //                 console.log('Subject:', item.Subject);
    //                 // @ts-ignore
    //                 console.log('Sender:', item.Sender.Name);
    //                 console.log('Received Time:', item.DateTimeReceived.toString());
    //             })
    //         }, function (errors) {
    //             console.log(errors)
    //         });
    // }

    // {
    //     // 定义 "Sent Items" 文件夹
    //     const sentItemsFolder = new ews.FolderId(ews.WellKnownFolderName.SentItems);

    //     // 使用 `FindItems` 方法获取已发送的邮件
    //     const view = new ews.ItemView(10); // 仅获取前10封已发送邮件
    //     exch.FindItems(sentItemsFolder, view)
    //         .then((response) => {
    //             response.Items.forEach((item) => {
    //                 console.log('Subject:', item.Subject);
    //                 console.log('To:', item.DisplayTo);
    //                 console.log('Sent Time:', item.DateTimeSent);
    //                 // 可以根据需要访问更多已发送邮件的属性
    //             });
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //         });
    // }

    // {
    //     const draftsFolder = new ews.FolderId(ews.WellKnownFolderName.ArchiveDeletedItems);

    //     // 使用 `FindItems` 方法获取草稿箱中的邮件
    //     const view = new ews.ItemView(10); // 仅获取前10封草稿邮件
    //     exch.FindItems(draftsFolder, view)
    //         .then((response) => {
    //             response.Items.forEach((item) => {
    //                 console.log('Subject:', item.Subject);
    //                 console.log('To:', item.DisplayTo);
    //                 console.log('Created Time:', item.DateTimeCreated);
    //                 // 可以根据需要访问更多草稿邮件的属性
    //             });
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //         });
    // }
}

main()