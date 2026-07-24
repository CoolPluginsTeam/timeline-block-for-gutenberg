( function () {
	'use strict';

	// The localized data object name is per-plugin (e.g. ctlOnboardingData),
	// announced on the page root so one shared script serves every plugin.
	var root = document.querySelector( '.cpo-onboarding-page' );
	if ( ! root ) {
		return;
	}
	var globalName = root.getAttribute( 'data-js-global' );
	var data = globalName ? window[ globalName ] : null;
	if ( typeof data !== 'object' || data === null ) {
		return;
	}

	/**
	 * Fire-and-forget telemetry. Uses sendBeacon so events survive the
	 * redirect that follows a Create click.
	 *
	 * @param {string} event  Event name.
	 * @param {string} bucket Optional bucket.
	 */
	function track( event, bucket ) {
		if ( ! data.track || ! data.track.action ) {
			return;
		}
		var params = new URLSearchParams();
		params.set( 'action', data.track.action );
		params.set( 'nonce', data.track.nonce );
		params.set( 'event', event );
		if ( bucket ) {
			params.set( 'bucket', bucket );
		}

		try {
			if ( typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function' ) {
				navigator.sendBeacon(
					data.ajaxUrl,
					new Blob( [ params.toString() ], { type: 'application/x-www-form-urlencoded' } )
				);
				return;
			}
		} catch ( e ) {}

		try {
			fetch( data.ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				keepalive: true,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: params.toString(),
			} ).catch( function () {} );
		} catch ( e ) {}
	}

	var cards = root.querySelectorAll( '.cpo-method-card' );
	var panels = root.querySelectorAll( '.cpo-panel' );
	var footers = root.querySelectorAll( '.cpo-footer[data-footer-for]' );
	var addonBlocks = root.querySelectorAll( '.cpo-addon-section[data-addon-for]' );
	var ctaButtons = root.querySelectorAll( '.cpo-create' );
	var videoBoxes = root.querySelectorAll( '.cpo-video-box' );

	// --- Inline notice helper (replaces window.alert) ---
	function showNotice( scope, message ) {
		if ( ! scope ) {
			return;
		}
		var notice = scope.querySelector( '.cpo-inline-notice' );
		if ( ! notice ) {
			return;
		}
		notice.textContent = message;
		notice.hidden = false;
	}

	function clearNotice( scope ) {
		if ( ! scope ) {
			return;
		}
		var notice = scope.querySelector( '.cpo-inline-notice' );
		if ( notice ) {
			notice.hidden = true;
			notice.textContent = '';
		}
	}

	// --- Inline video playback ---
	videoBoxes.forEach( function ( box ) {
		var played = false;
		box.addEventListener( 'click', function () {
			if ( played ) {
				return;
			}
			played = true;
			track( 'video_played', box.getAttribute( 'data-type' ) || '' );

			var videoId = box.getAttribute( 'data-video-id' );
			if ( ! videoId ) {
				return;
			}
			var start = parseInt( box.getAttribute( 'data-start' ) || '0', 10 );
			var params = new URLSearchParams( {
				autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1',
			} );
			if ( start > 0 ) {
				params.set( 'start', String( start ) );
			}

			var iframe = document.createElement( 'iframe' );
			iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent( videoId ) + '?' + params.toString();
			iframe.title = box.getAttribute( 'aria-label' ) || 'YouTube video';
			iframe.setAttribute( 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' );
			iframe.setAttribute( 'allowfullscreen', '' );
			iframe.setAttribute( 'frameborder', '0' );
			iframe.style.position = 'absolute';
			iframe.style.inset = '0';
			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.style.border = '0';

			box.innerHTML = '';
			box.appendChild( iframe );
			box.classList.add( 'is-playing' );
		} );
	} );

	// --- Method card switching ---
	function setActivePanel( panelKey ) {
		panels.forEach( function ( p ) {
			p.classList.toggle( 'active', p.id === 'cpo-panel-' + panelKey );
		} );
		// Footer follows the active editor selection. If no footer matches the picked
		// method (e.g. only a global footer exists), leave the current footer in place.
		if ( footers.length ) {
			var hasMatch = false;
			footers.forEach( function ( f ) {
				if ( f.getAttribute( 'data-footer-for' ) === panelKey ) {
					hasMatch = true;
				}
			} );
			if ( hasMatch ) {
				footers.forEach( function ( f ) {
					f.classList.toggle( 'active', f.getAttribute( 'data-footer-for' ) === panelKey );
				} );
			}
		}
		// Always sync addon sections to the active method tab.
		if ( addonBlocks.length ) {
			addonBlocks.forEach( function ( block ) {
				block.classList.toggle( 'active', block.getAttribute( 'data-addon-for' ) === panelKey );
			} );
		}
	}

	cards.forEach( function ( card ) {
		card.addEventListener( 'click', function () {
			if ( this.classList.contains( 'active' ) ) {
				return;
			}
			cards.forEach( function ( c ) {
				c.classList.remove( 'active' );
				c.setAttribute( 'aria-checked', 'false' );
			} );
			this.classList.add( 'active' );
			this.setAttribute( 'aria-checked', 'true' );

			var pickedType = this.getAttribute( 'data-type' );
			if ( pickedType ) {
				track( 'method_picked', pickedType );
			}
			var panelKey = this.getAttribute( 'data-panel' );
			if ( panelKey ) {
				setActivePanel( panelKey );
			}
		} );
		card.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				this.click();
			}
		} );
	} );

	var initialCard = root.querySelector( '.cpo-method-card.active' );
	if ( initialCard ) {
		setActivePanel( initialCard.getAttribute( 'data-panel' ) );
	}

	// --- Create / prepare ---
	function prepareMethod( btn ) {
		if ( btn.classList.contains( 'is-loading' ) ) {
			return;
		}
		var methodType = btn.getAttribute( 'data-method-type' );
		if ( ! methodType ) {
			return;
		}

		var scope = btn.closest( '.cpo-panel' );
		clearNotice( scope );
		track( 'cta_clicked', methodType );

		var didNavigate = false;
		var labelEl = btn.querySelector( '.cpo-btn-label' );
		var spin = btn.querySelector( '.spinner' );
		var defaultLabel = labelEl ? labelEl.textContent : '';

		btn.classList.add( 'is-loading' );
		btn.setAttribute( 'aria-busy', 'true' );
		btn.disabled = true;
		if ( spin ) {
			spin.classList.add( 'is-active' );
		}
		if ( labelEl && data.labels && data.labels.loading ) {
			labelEl.textContent = data.labels.loading;
		}

		var body = new URLSearchParams();
		body.set( 'action', data.action );
		body.set( 'nonce', data.nonce );
		body.set( 'method_type', methodType );

		fetch( data.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString(),
		} )
			.then( function ( res ) {
				return res.json();
			} )
			.then( function ( json ) {
				var url = json && json.success && json.data && json.data.redirectUrl
					? json.data.redirectUrl
					: '';
				if ( url ) {
					didNavigate = true;
					if ( labelEl && data.labels && data.labels.redirecting ) {
						labelEl.textContent = data.labels.redirecting;
					}
					window.location.assign( url );
					return;
				}
				track( 'cta_failed', methodType );
				var fallback = data.redirects && data.redirects[ methodType ];
				if ( fallback ) {
					didNavigate = true;
					window.location.assign( fallback );
				}
			} )
			.catch( function () {
				track( 'cta_failed', methodType );
				var fallback = data.redirects && data.redirects[ methodType ];
				if ( fallback ) {
					didNavigate = true;
					window.location.assign( fallback );
				}
			} )
			.finally( function () {
				if ( didNavigate ) {
					return;
				}
				if ( spin ) {
					spin.classList.remove( 'is-active' );
				}
				btn.classList.remove( 'is-loading' );
				btn.removeAttribute( 'aria-busy' );
				btn.disabled = false;
				if ( labelEl ) {
					labelEl.textContent = defaultLabel;
				}
				showNotice( scope, ( data.labels && data.labels.error ) || 'Something went wrong. Please try again.' );
			} );
	}

	ctaButtons.forEach( function ( btn ) {
		btn.addEventListener( 'click', function () {
			prepareMethod( btn );
		} );
	} );

	// --- Addon install / activate ---
	function installPlugin( btn ) {
		if ( btn.disabled || btn.classList.contains( 'is-loading' ) ) {
			return;
		}
		var slug = btn.getAttribute( 'data-slug' );
		var nonce = btn.getAttribute( 'data-nonce' );
		var install = data.install;
		if ( ! slug || ! nonce || ! install || ! install.action ) {
			return;
		}

		track( 'addon_install_clicked', slug );

		var state = btn.getAttribute( 'data-state' );
		var labelEl = btn.querySelector( '.cpo-install-label' );
		var spin = btn.querySelector( '.spinner' );
		var originalLabel = labelEl ? labelEl.textContent : '';
		var isActivate = state === 'activate';

		btn.classList.add( 'is-loading' );
		btn.disabled = true;
		if ( spin ) {
			spin.classList.add( 'is-active' );
		}
		if ( labelEl ) {
			labelEl.textContent = isActivate ? install.labels.activating : install.labels.installing;
		}

		var body = new URLSearchParams();
		body.set( 'action', install.action );
		body.set( 'wp_nonce', nonce );
		body.set( 'slug', slug );

		fetch( data.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			body: body.toString(),
		} )
			.then( function ( res ) {
				return res.text();
			} )
			.then( function ( text ) {
				var trimmed = ( text || '' ).trim();
				if ( trimmed.length > 2000 &&
					( trimmed.indexOf( '<!' ) === 0 || trimmed.indexOf( '<html' ) !== -1 || trimmed.indexOf( '<!DOCTYPE' ) !== -1 ) ) {
					markActivated( btn, labelEl, spin );
					return;
				}
				var response = null;
				var idx = text.indexOf( '{' );
				if ( idx !== -1 ) {
					try {
						response = JSON.parse( text.substring( idx ) );
					} catch ( e ) {}
				}
				if ( response && response.success ) {
					var redirectUrl = response.data && response.data.redirectUrl
						? response.data.redirectUrl
						: '';
					markActivated( btn, labelEl, spin, redirectUrl );
					return;
				}
				var errMsg = response && response.data
					? ( response.data.errorMessage || response.data.message || '' )
					: '';
				resetButton( btn, labelEl, spin, originalLabel, errMsg || install.labels.error );
			} )
			.catch( function () {
				resetButton( btn, labelEl, spin, originalLabel, install.labels.error );
			} );
	}

	function markActivated( btn, labelEl, spin, redirectUrl ) {
		if ( spin ) {
			spin.classList.remove( 'is-active' );
		}
		btn.classList.remove( 'is-loading' );
		btn.classList.add( 'is-activated' );
		btn.setAttribute( 'data-state', 'activated' );
		btn.disabled = true;
		if ( labelEl && data.install && data.install.labels ) {
			labelEl.textContent = data.install.labels.activated;
		}
		var setupUrl = redirectUrl || btn.getAttribute( 'data-setup-url' );
		if ( setupUrl ) {
			if ( labelEl && data.labels && data.labels.redirecting ) {
				labelEl.textContent = data.labels.redirecting;
			}
			window.location.assign( setupUrl );
			return;
		}
		appendSetupGuideLink( btn );
	}

	function appendSetupGuideLink( btn ) {
		var setupUrl = btn.getAttribute( 'data-setup-url' );
		if ( ! setupUrl ) {
			return;
		}
		var container = btn.parentNode;
		if ( ! container || container.querySelector( '.cpo-setup-guide' ) ) {
			return;
		}
		var link = document.createElement( 'a' );
		link.className = 'button button-secondary cpo-setup-guide';
		link.href = setupUrl;
		link.textContent = ( data.install.labels && data.install.labels.setupGuide ) || 'Check Setup Guide';
		btn.insertAdjacentElement( 'afterend', link );
	}

	function resetButton( btn, labelEl, spin, originalLabel, errorMessage ) {
		if ( spin ) {
			spin.classList.remove( 'is-active' );
		}
		btn.classList.remove( 'is-loading' );
		btn.disabled = false;
		if ( labelEl ) {
			labelEl.textContent = originalLabel;
		}
		if ( errorMessage ) {
			var scope = btn.closest( '.cpo-addon-card' );
			showNotice( scope, errorMessage );
		}
	}

	root.querySelectorAll( '.cpo-install-plugin' ).forEach( function ( btn ) {
		btn.addEventListener( 'click', function () {
			installPlugin( btn );
		} );
	} );
} )();
