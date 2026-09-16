"""Focused integrity tests for external-data boundaries; no network calls."""
import unittest
from unittest.mock import patch
import sync
class DataIntegrity(unittest.TestCase):
    def test_duplicate_records_preserve_orcid_date_and_attach_metrics(self):
        a={'title':'Hydrogen systems','doi':'10.1/ABC','year':'2025','journal':'Energy','url':'https://doi.org/10.1/ABC','source':'ORCID'}
        b={**a,'doi':'10.1/abc','year':'2024','source':'OpenAlex','citations':12,'citationSource':'OpenAlex'}
        rows=sync.merge_publications([a],[b])
        self.assertEqual(len(rows),1);self.assertEqual(rows[0]['year'],'2025');self.assertEqual(rows[0]['citations'],12)
        self.assertEqual(a['source'],'ORCID')
    def test_title_match_for_record_without_doi(self):
        a={'title':'Hydrogen Systems','doi':'10.1/a','source':'ORCID'}
        b={'title':'Hydrogen systems','source':'Google Scholar'}
        self.assertEqual(len(sync.merge_publications([a],[b])),1)
    def test_allowlist_rejects_lookalikes_and_insecure_links(self):
        self.assertTrue(sync.allowed('https://www.iea.org/news/a'))
        self.assertFalse(sync.allowed('https://iea.org.example.com/news/a'))
        self.assertFalse(sync.allowed('javascript:alert(1)'))
        self.assertFalse(sync.allowed('http://www.iea.org/news/a'))
    def test_fetch_failure_preserves_last_success(self):
        source={'name':'IEA','url':'https://www.iea.org/news','category':'Global SAF','kind':'discovery'}
        with patch.object(sync,'get',side_effect=TimeoutError):
            state,rows=sync.collect_source(source,{'lastSuccess':'2026-01-01','hash':'old'})
        self.assertEqual(state['lastSuccess'],'2026-01-01');self.assertEqual(state['hash'],'old');self.assertEqual(rows,[])
    def test_policy_baseline_is_not_presented_as_change(self):
        source={'name':'RED','url':'https://energy.ec.europa.eu/test','category':'EU policy','kind':'monitor'}
        with patch.object(sync,'get',return_value=(b'<main>Legislation content</main>',source['url'])):
            baseline,rows=sync.collect_source(source,None)
            self.assertEqual(rows,[])
            _,rows=sync.collect_source(source,baseline)
            self.assertEqual(rows,[])
            _,rows=sync.collect_source(source,{**baseline,'hash':'different'})
            self.assertEqual(rows[0]['kind'],'Page change')
    def test_rss_topic_filter_and_domain_filter(self):
        body=b'<rss><channel><item><title>Sustainable aviation fuel developments</title><link>https://www.theguardian.com/news/valid</link><pubDate>Wed, 16 Sep 2026 10:00:00 GMT</pubDate></item><item><title>Sustainable aviation fuel spam</title><link>https://evil.example/a</link></item><item><title>Unrelated sporting event</title><link>https://www.theguardian.com/sport/a</link></item></channel></rss>'
        source={'name':'The Guardian','url':'https://www.theguardian.com/environment/rss','kind':'rss','category':'Global SAF'}
        with patch.object(sync,'get',return_value=(body,source['url'])):
            _,rows=sync.collect_source(source,None)
        self.assertEqual(len(rows),1);self.assertEqual(rows[0]['date'],'2026-09-16T10:00:00+00:00')
if __name__=='__main__':unittest.main()
