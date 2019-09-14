//eval(UrlFetchApp.fetch('https://rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText())
var FOLDER_NAME = "training_emails";
function getId(message) {
  var subject = message.getSubject();
  var date = message.getDate();
  var id = CryptoJS.MD5(Session.getActiveUser().getEmail() + "_" + date + "_" + subject).toString();
  return id;
}

/**
 * SaveData 
 *
 * @param {Object} e The data provided by the Gmail UI.
*/
function saveData(e) {
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  Logger.log("saving");
  
  var messageId = e.messageMetadata.messageId;
  
  saveMail(messageId);
  
  var card = CardService.newCardBuilder();
  card.addSection(CardService.newCardSection()
                  .addWidget(CardService.newTextParagraph()
                             .setText(messageId))
                 );
  
  card.addSection(CardService.newCardSection()
                    .addWidget(CardService.newKeyValue()
                               .setTopLabel("Email already in Training Data")
                               .setContent("This mail is already in training data set."))
                   );

  card.addSection(CardService.newCardSection()
                  .addWidget(CardService.newTextButton()
                             .setText("Download Zipped Training Emails")
                             .setOnClickAction(CardService.newAction().setFunctionName("downloadZipped")))
                 );
return CardService.newNavigation().updateCard(card.build())
  
}

/**
 * Returns the array of cards that should be rendered for the current
 * e-mail thread. The name of this function is specified in the
 * manifest 'onTriggerFunction' field, indicating that this function
 * runs every time the add-on is started.
 *
 * @param {Object} e The data provided by the Gmail UI.
 * @return {Card[]}
 */
function buildAddOn(e) {
  // Activate temporary Gmail add-on scopes.
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  var messageId = e.messageMetadata.messageId;
  
  var card = CardService.newCardBuilder();

  card.addSection(CardService.newCardSection()
                  .addWidget(CardService.newTextParagraph()
                             .setText(messageId))
                 );

  var messageIdSet = getMessageIdSet();
  Logger.log("messageId = " + messageId);
  Logger.log("messageIdSet = " + messageIdSet.join(","));
  
  if (messageIdSet.indexOf(messageId) != -1) {
    Logger.log("messageId not found");
    
    card.addSection(CardService.newCardSection()
                    .addWidget(CardService.newKeyValue()
                               .setTopLabel("Email already in Training Data")
                               .setContent("This mail is already in training data set."))
                   );
  } else {
    card.addSection(CardService.newCardSection()
                    .addWidget(CardService.newTextButton()
                               .setText("Add Email to Training Data")
                               .setOnClickAction(CardService.newAction().setFunctionName("saveData")))
                   );
  }  
  card.addSection(CardService.newCardSection()
                  .addWidget(CardService.newTextButton()
                             .setText("Download Zipped Training Emails")
                             .setOnClickAction(CardService.newAction().setFunctionName("downloadZipped")))
                  );
  card.addSection(CardService.newCardSection()
                  .addWidget(CardService.newTextButton()
                             .setText("Clear Training Emails")
                             .setOnClickAction(CardService.newAction().setFunctionName("clearMails")))
                  );
  
  return [card.build()];
}

function downloadZipped(e) {
  // Activate temporary Gmail add-on scopes.
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  
  var messageIdSet = getMessageIdSet();
  
  if (!messageIdSet || messageIdSet.size < 1) {
    return;
  }
  var mailBlobs =[];
  messageIdSet.forEach(function(messageId) {
    var message = GmailApp.getMessageById(messageId);
    GmailApp.setCurrentMessageAccessToken(accessToken);
    var eml = message.getRawContent();
    var mailBlob = Utilities.newBlob(eml, "text/plain", messageId);
    mailBlobs.push(mailBlob);
  });
  var zipBlob = Utilities.zip(mailBlobs);
  HtmlService.createHtmlOutput(zipBlob).getAs('application/zip');
}

function getMessageIdSet() {
  var folder = DriveApp.getFoldersByName(FOLDER_NAME);
  
  var messageIdSet = [];

  while (folder.hasNext()) {
    var files = folder.next().getFiles();
    while (files.hasNext()) {
      var file = files.next();
      messageIdSet.push(file.getName().slice(0, -4));
    }

  }
  Logger.log("messageIdSet = " + messageIdSet.join(","));
  return messageIdSet;
}

/** 
 * Append messageId to messageIdSet
 * Return true, if message wasn't already in set
 * false otherwise;
 */
function appendMessageIdToSet(messageId) {
  var messageIdSet = getMessageIdSet()  
  if (messageIdSet.indexOf(messageId) == -1) {
    messageIdSet.push(messageId);
    var userProps = PropertiesService.getUserProperties();
    var messageIdSetString = messageIdSet.join(",");
    Logger.log("messageIdSetString = " + messageIdSetString);
    userProps.setProperty("messageIdSet", messageIdSetString);
    return true;
  } 
  return false;
}

function clearMails() {
  var userProps = PropertiesService.getUserProperties();
  userProps.deleteProperty("messageIdSet");
  return;
}

function saveMail(messageId) {

  var folder = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!folder.hasNext()) {
    folder = DriveApp.createFolder(FOLDER_NAME);
  } else {
    folder = folder.next();
  }
  var message = GmailApp.getMessageById(messageId);
  var eml = message.getRawContent();
  folder.createFile(messageId+".eml", eml);
}

