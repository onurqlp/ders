package com.aydadil.ders

import org.junit.Assert.*
import org.junit.Test

class NavigationPolicyTest {
    @Test fun productionAllowsOnlyAydaHostsAndCoursePaths() {
        assertTrue(NavigationPolicy.isAllowed("https://ders.aydadil.com/", false))
        assertTrue(NavigationPolicy.isAllowed("https://www.aydadil.com/a1ayda/lesson", false))
        assertTrue(NavigationPolicy.isAllowed("https://osd.aydadil.com/test", false))
        assertFalse(NavigationPolicy.isAllowed("https://www.aydadil.com/private", false))
        assertFalse(NavigationPolicy.isAllowed("https://aydadil.com/", false))
        assertFalse(NavigationPolicy.isAllowed("https://evil-aydadil.com/", false))
    }

    @Test fun blocksInsecureAndAmbiguousUrls() {
        assertFalse(NavigationPolicy.isAllowed("http://ders.aydadil.com/", false))
        assertFalse(NavigationPolicy.isAllowed("https://user@ders.aydadil.com/", false))
        assertFalse(NavigationPolicy.isAllowed("https://ders.aydadil.com:444/", false))
    }

    @Test fun previewAllowsItsEntryAndVerifiedAydaDestinations() {
        assertTrue(NavigationPolicy.isAllowed("https://htmlpreview.github.io/?https://github.com/onurqlp/ders/blob/a85e3f30be72afc69419bd15b42005ac1fb4fbaa/index.html", true))
        assertTrue(NavigationPolicy.isAllowed("https://www.aydadil.com/a1ayda/", true))
        assertTrue(NavigationPolicy.isAllowed("https://osd.aydadil.com/", true))
        assertFalse(NavigationPolicy.isAllowed("https://htmlpreview.github.io/", true))
        assertFalse(NavigationPolicy.isAllowed("https://evil.example/", true))
    }
}
