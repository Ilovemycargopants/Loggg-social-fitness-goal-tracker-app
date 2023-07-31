const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateLogClearStatus = functions.firestore
    .document('Logs/{logId}')
    .onUpdate(async (change, context) => {
        // Retrieve the data of the document after and before the update
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // If votes, thumbsUp, or thumbsDown fields are missing, just return
        if (
            !newValue.votes ||
            !previousValue.votes ||
            !('thumbsUp' in newValue.votes) ||
            !('thumbsDown' in newValue.votes)
        ) {
            return null;
        }

        // If the number of thumbsUp and thumbsDown votes hasn't changed, return
        if (
            newValue.votes.thumbsUp === previousValue.votes.thumbsUp &&
            newValue.votes.thumbsDown === previousValue.votes.thumbsDown
        ) {
            return null;
        }

        // Retrieve the group document associated with this log
        const groupSnapshot = await admin.firestore()
            .collection('Groups')
            .doc(newValue.groupId)
            .get();

        if (!groupSnapshot.exists) {
            return null;
        }

        // Get the number of group members
        const groupData = groupSnapshot.data();
        const membersSize = groupData.members ? groupData.members.length : 0;

        // If the group has no members, just return
        if (membersSize === 0) {
            return null;
        }

        // If the number of thumbsUp votes is greater than or equal to half the group size, set cleared to true
        if (newValue.votes.thumbsUp >= membersSize / 2) {
            return change.after.ref.update({ cleared: true });
        }

        // If the number of thumbsDown votes is greater than or equal to half the group size, delete the log document
        else if (newValue.votes.thumbsDown >= membersSize / 2) {
            return change.after.ref.delete();
        }

        return null;
    });

    exports.resetDailyWallets = functions.pubsub.schedule('59 23 * * *').onRun(async (context) => {
        let lastDocument = null;
        const batchSize = 500;
    
        // Function to handle a single batch of Wallets
        async function processBatch(lastDocument) {
            const walletsRef = admin.firestore().collection('Wallets');
            let walletsQuery = walletsRef.orderBy('groupCode').limit(batchSize);
    
            // If this isn't the first batch, start after the last document from the previous batch
            if (lastDocument) {
                walletsQuery = walletsQuery.startAfter(lastDocument);
            }
    
            // Retrieve the Wallets and process them
            const walletsSnapshot = await walletsQuery.get();
            if (walletsSnapshot.size > 0) {
                const batch = admin.firestore().batch();
                walletsSnapshot.forEach(wallet => {
                    const walletRef = walletsRef.doc(wallet.id);
                    batch.update(walletRef, { daily: 0 });
                });
                await batch.commit();
    
                // Remember the last document in this batch for the next one
                lastDocument = walletsSnapshot.docs[walletsSnapshot.docs.length - 1];
            }
    
            // Return whether there are potentially more Wallets to process
            return walletsSnapshot.size === batchSize;
        }
    
        // Process batches until there are no more Wallets
        let hasMore = true;
        while (hasMore) {
            hasMore = await processBatch(lastDocument);
        }
    });
    // This function will be run every Sunday at 11:59 PM
exports.resetWeeklyWallets = functions.pubsub.schedule('59 23 * * 0').onRun(async (context) => {
    let lastDocument = null;
    const batchSize = 500;

    // Function to handle a single batch of Wallets
    async function processBatch(lastDocument) {
        const walletsRef = admin.firestore().collection('Wallets');
        let walletsQuery = walletsRef.orderBy('groupCode').limit(batchSize);

        // If this isn't the first batch, start after the last document from the previous batch
        if (lastDocument) {
            walletsQuery = walletsQuery.startAfter(lastDocument);
        }

        // Retrieve the Wallets and process them
        const walletsSnapshot = await walletsQuery.get();
        if (walletsSnapshot.size > 0) {
            const batch = admin.firestore().batch();
            walletsSnapshot.forEach(wallet => {
                const walletRef = walletsRef.doc(wallet.id);
                batch.update(walletRef, { weekly: 0 });
            });
            await batch.commit();

            // Remember the last document in this batch for the next one
            lastDocument = walletsSnapshot.docs[walletsSnapshot.docs.length - 1];
        }

        // Return whether there are potentially more Wallets to process
        return walletsSnapshot.size === batchSize;
    }

    // Process batches until there are no more Wallets
    let hasMore = true;
    while (hasMore) {
        hasMore = await processBatch(lastDocument);
    }
});
// Last day of the month reset 
exports.resetMonthlyWallets = functions.pubsub.schedule('59 23 * * *').onRun(async (context) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // If tomorrow's month is not the same as today's, then today is the last day of the month
    if (tomorrow.getMonth() !== now.getMonth()) {
        let lastDocument = null;
        const batchSize = 500;

        // Function to handle a single batch of Wallets
        async function processBatch(lastDocument) {
            const walletsRef = admin.firestore().collection('Wallets');
            let walletsQuery = walletsRef.orderBy('groupCode').limit(batchSize);

            // If this isn't the first batch, start after the last document from the previous batch
            if (lastDocument) {
                walletsQuery = walletsQuery.startAfter(lastDocument);
            }

            // Retrieve the Wallets and process them
            const walletsSnapshot = await walletsQuery.get();
            if (walletsSnapshot.size > 0) {
                const batch = admin.firestore().batch();
                walletsSnapshot.forEach(wallet => {
                    const walletRef = walletsRef.doc(wallet.id);
                    batch.update(walletRef, { monthly: 0 });
                });
                await batch.commit();

                // Remember the last document in this batch for the next one
                lastDocument = walletsSnapshot.docs[walletsSnapshot.docs.length - 1];
            }

            // Return whether there are potentially more Wallets to process
            return walletsSnapshot.size === batchSize;
        }

        // Process batches until there are no more Wallets
        let hasMore = true;
        while (hasMore) {
            hasMore = await processBatch(lastDocument);
        }
    }
});

exports.addPointsToWallet = functions.firestore
    .document('Logs/{logId}')
    .onUpdate(async (change, context) => {
        // Retrieve the data of the document after and before the update
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // If the cleared field hasn't changed, or if it has changed but is not true, return
        if (newValue.cleared === previousValue.cleared || newValue.cleared !== true) {
            console.log('Log did not clear');
            return null;
        }

        // If the cleared field has changed and is now true, find the matching Wallet and add the totalPoints
        const walletRef = admin.firestore().collection('Wallets').where('groupCode', '==', newValue.groupId)
            .where('owner', '==', newValue.user.id);
        const walletSnapshot = await walletRef.get();

        if (!walletSnapshot.empty) {
            const walletDoc = walletSnapshot.docs[0];
            const walletData = walletDoc.data();

            // Update the Wallet's daily, weekly, and monthly fields by adding the totalPoints from the Log
            const updatedWalletData = {
                daily: Number(walletData.daily) + newValue.goal.pointTotal ,
                weekly: Number(walletData.weekly) + newValue.goal.pointTotal ,
                monthly: Number(walletData.monthly) + newValue.goal.pointTotal ,
                total: Number(walletData.total) + newValue.goal.pointTotal ,
            };

            return walletDoc.ref.update(updatedWalletData);
        } else {
            console.log('No matching Wallet found');
            return null;
        }
    });
    // Function triggers when a User document is deleted
exports.onUserDeleted = functions.firestore
.document('Users/{userId}')
.onDelete(async (snap, context) => {
  // Get the userId from the deleted document's parameters
  const userId = context.params.userId;

  // Fetch any wallet documents that are 'owned' by the deleted user
  const walletsSnapshot = await admin.firestore().collection('Wallets')
    .where('owner', '==', userId).get();
  
  // For each fetched wallet, delete the document
  walletsSnapshot.forEach((doc) => {
    doc.ref.delete();
  });

  // Fetch all group documents
  const groupsSnapshot = await admin.firestore().collection('Groups').get();
  
  // For each group, check if the deleted user is a member
  groupsSnapshot.forEach(async (groupDoc) => {
    const groupData = groupDoc.data();

    // If the members array includes the userId, remove it
    if (groupData.members && groupData.members.includes(userId)) {
      // Update the group document to remove the userId from the members array
      groupDoc.ref.update({
        'members': admin.firestore.FieldValue.arrayRemove(userId)
      });
    }
  });
});

  

    exports.onUserGroupsChange = functions.firestore
    .document('Users/{userId}/Groups/{groupId}')
    .onWrite(async (change, context) => {
        const userId = context.params.userId;

        // Fetching all wallet documents with 'owner' matching userId
        const walletsSnapshot = await admin.firestore().collection('Wallets')
            .where('owner', '==', userId).get();

        // Looping over each wallet document
        walletsSnapshot.forEach(async (walletDoc) => {
            const walletData = walletDoc.data();

            // Checking if user still has group in their groups sub-collection
            const userGroupDoc = await admin.firestore().doc(`Users/${userId}/Groups/${walletData.groupCode}`).get();

            // If userGroupDoc doesn't exist, delete this wallet
            if (!userGroupDoc.exists) {
                await walletDoc.ref.delete();
            }
        });

        // Fetch all group documents
        const groupsSnapshot = await admin.firestore().collection('Groups').get();

        // Looping over each group document
        groupsSnapshot.forEach(async (groupDoc) => {
            const groupData = groupDoc.data();

            // If the members map includes userId, remove it
            if (groupData.members && groupData.members.includes(userId)) {
                // Using Firestore transaction to safely update members map
                await admin.firestore().runTransaction(async (t) => {
                    t.update(groupDoc.ref, {
                        members: admin.firestore.FieldValue.arrayRemove(userId)
                    });
                });
            }
        });
    });

  



