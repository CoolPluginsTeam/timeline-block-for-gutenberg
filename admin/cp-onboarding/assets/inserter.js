/**
 * Cool Timeline — Auto-insert block on the new page screen.
 *
 * Triggers only when the page URL contains: ?action=filter-ctlb-blocks
 * Uses the Gutenberg data layer (no DOM scraping).
 */
( function ( wp ) {
	'use strict';

	wp.domReady( function () {
		const urlParams = new URLSearchParams( window.location.search );

		// Only run on our trigger.
		if ( urlParams.get( 'action' ) !== 'filter-ctlb-blocks' ) {
			return;
		}

		const { createBlock, getBlockType } = wp.blocks;
		const { dispatch, select } = wp.data;

		// Change this to your registered block name (from block.json "name").
		const BLOCK_NAME = 'cp-timeline/content-timeline-block';

		let done = false;
		let attempts = 0;
		const MAX_ATTEMPTS = 100; // ~20s at 200ms — hard stop so we never spin forever.

		/**
		 * Attempt to insert the block once all the editor preconditions are met.
		 *
		 * @return {boolean} True once the block has been inserted (or already exists),
		 *                   meaning no further attempts are needed.
		 */
		function tryInsert() {
			if ( done ) {
				return true;
			}

			attempts++;

			const blockEditor = select( 'core/block-editor' );
			const editor = select( 'core/editor' );

			// Make sure stores exist.
			if ( ! blockEditor || ! editor ) {
				return false;
			}

			// Wait until the editor has finished loading existing content.
			const isReady =
				typeof editor.__unstableIsEditorReady === 'function'
					? editor.__unstableIsEditorReady()
					: true;

			if ( ! isReady ) {
				return false;
			}

			// Make sure the block type is actually registered before inserting.
			if ( ! getBlockType( BLOCK_NAME ) ) {
				return false;
			}

			// Avoid duplicate inserts if the block already exists on the page.
			const existing = blockEditor
				.getBlocks()
				.some( function ( block ) {
					return block.name === BLOCK_NAME;
				} );

			if ( existing ) {
				done = true;
				return true;
			}

			// Lock it in.
			done = true;

			const block = createBlock( BLOCK_NAME, {} );

			// Insert at the top of the page, then select it.
			dispatch( 'core/block-editor' ).insertBlocks( block, 0 );
			dispatch( 'core/block-editor' ).selectBlock( block.clientId );

			return true;
		}

		// The script loads in the footer, so the editor may already be initialized
		// and idle by the time this runs — try immediately first.
		if ( tryInsert() ) {
			return;
		}

		// Otherwise poll until the editor is ready and the block type is registered.
		// wp.data.subscribe() only fires on the *next* store mutation, which may
		// never happen once the editor settles, so an interval is more reliable.
		const timer = setInterval( function () {
			if ( tryInsert() || attempts >= MAX_ATTEMPTS ) {
				clearInterval( timer );
			}
		}, 200 );
	} );
} )( window.wp );
