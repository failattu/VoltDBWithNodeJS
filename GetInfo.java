import org.voltdb.*; 

public class GetInfo extends VoltProcedure { 
	public final SQLStmt GetEventCount = new SQLStmt( 
		"SELECT COUNT(*) AS EventCount FROM Events WHERE UID = ? AND Event = ?;"
	);
	public long run( int userID, int eventID) 
        throws VoltAbortException {   
		
			long count;
			VoltTable[] queryresults;
			
			voltQueueSQL( GetEventCount, userID, eventID); 
			queryresults = voltExecuteSQL();		
			VoltTable result = queryresults[0];
			
			if (result.getRowCount() < 1) { return -1; }
			
			count = result.fetchRow(0).getLong(0);
			
			return count;
		}
}
