//------------------------------------------
// Invision Power Board v2.1
// Profile JS File
// (c) 2005 Invision Power Services, Inc.
//
// http://www.invisionboard.com
//------------------------------------------



/*--------------------------------------------*/
// Profile: Open pop-up window
/*--------------------------------------------*/

function profile_dname_history( mid )
{
	//----------------------------------
	// Attempt to close the menu
	//----------------------------------
	
	try
	{
		menu_action_close();
	}
	catch(e)
	{
	}
	
	//----------------------------------
	// Launch Pop Up
	//----------------------------------
	
	PopUp( ipb_var_base_url + 'act=profile&CODE=show-display-names&id=' + mid, 'DNAMETITLE', 400, 300 );
	
	return false;
}