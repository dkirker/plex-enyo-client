enyo.kind({
	name: "plex.MainView",
	kind: enyo.HFlexBox,
	components: [
		{kind:enyo.Pane, flex: 1, components: [
			{name: "mainBrowsingView", kind: enyo.Control, layoutKind: "HFlexLayout", components:[
				{kind:enyo.VFlexBox, width:'320px', height: "100%", style:"border-right: 2px solid;", components: [
					{flex: 1, name: "left_pane", kind: "Pane", components: [
						{kind: "plex.SectionsView", name: "view_sections",flex:1}
					]}
				]},
				{kind:enyo.VFlexBox, flex:1, components: [
		 			{flex: 1, name: "right_pane", align: "center", pack: "center",kind: "Pane", onSelectView: "viewSelected", components: [
						{kind: "plex.GridView", name: "grid_view"}
					]}
				]},

				//{name: "PlayerControl", kind: 'kindPlayerControl', onClickNext: "onClickNext", onClickPrev: "onClickPrev" , onClickPlayPause: "onClickPlayPause", onSetPlaybackTime:"onSetPlaybackTime", onShuffleClick: "onShuffleClick_PlayModeControls", onRepeatClick: "onRepeatClick_PlayModeControls", onSetVolume: "onSetPlaybackVolume" , onRequestVolume: "onRequestSysVolume", onClickFullScreen: "onClick_FullScreen"},

				{kind: "AppMenu",
				    components: [
				        {caption: "Preferences", onclick: "showPreferences"},
				    ]
				},

			]},
			{name:"prefsView", kind:"plex.PreferencesView", lazy: true, showing: false, onClose:"closePrefsView"},
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.pane.selectViewByName("mainBrowsingView");
		this.rootMediaContainer = "";
		this.selectedSection = "";
		var plexReq = new PlexRequest(enyo.bind(this,"gotSections"));
		plexReq.librarySections();
		
	},
	gotSections: function(plexMediaContainer) {
		this.rootMediaContainer = plexMediaContainer;
		//this.$.left_pane.createComponents([{kind: "plex.SectionsView", name: "view_sections", parentMediaContainer: plexMediaContainer,headerContent: plexMediaContainer.title1, flex:1, owner:this}]);
		this.log("fyllde på sektioner");
		this.$.left_pane.render();
		this.$.left_pane.selectViewByName("view_sections");
		this.$.view_sections.setParentMediaContainer(this.rootMediaContainer);
	},
	showGridView: function(section) {
		this.selectedSection = section;
    	this.$.right_pane.selectViewByName("grid_view");
	},
	viewSelected: function(inSender, inView, inPreviousView) {
	    inView.setParentMediaContainer(this.selectedSection);
	},
	showPreferences: function() {
		this.$.pane.selectViewByName("prefsView");
	},
	preferencesReceived: function(inSender, inDefaultUrl) {
	    this.$.search.setFeedUrl(inDefaultUrl);
	},
	serverFormSaved: function(inSender, inFeedUrl) {
	    this.$.search.setFeedUrl(inFeedUrl);
	    this.$.pane.back();
	},
	preferencesCanceled: function(inSender) {
	    this.$.left_pane.back();
	},
	openAppMenuHandler: function() {
	    this.$.appMenu.open();
	},
	closeAppMenuHandler: function() {
	    this.$.appMenu.close();
	},
	closePrefsView: function(inView) {
		this.$.pane.back();
	},
});