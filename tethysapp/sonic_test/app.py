from tethys_sdk.base import TethysAppBase, url_map_maker


class SonicTest(TethysAppBase):
    """
    Tethys app class for Sonic Test.
    """

    name = 'Sonic Test'
    index = 'sonic_test:home'
    icon = 'sonic_test/images/icon.gif'
    package = 'sonic_test'
    root_url = 'sonic-test'
    color = '#2c3e50'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='sonic-test',
                controller='sonic_test.controllers.home'
            ),
            UrlMap(
                name='get_hydrographs',
                url='get-hydrographs',
                controller='sonic_test.controllers.get_hydrographs'
            ),
        )

        return url_maps